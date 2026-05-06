from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.db import transaction

from apps.accounts.models import OTPCode
from apps.common.utils.tokens import generate_otp_code
from apps.common.utils.helpers import send_email

User = get_user_model()


class AuthService:
    @staticmethod
    @transaction.atomic
    def register(data):
        from apps.accounts.serializers import UserRegisterSerializer

        serializer = UserRegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return user, getattr(user, "_otp_code", None)

    @staticmethod
    def authenticate(email=None, phone=None, password=None):
        from django.contrib.auth import authenticate

        if email:
            return authenticate(username=email, password=password)
        if phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return None
            return authenticate(username=user.email, password=password)
        return None

    @staticmethod
    def send_otp(user, purpose, contact=None):
        OTPCode.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)

        code = generate_otp_code()
        otp = OTPCode.objects.create(
            user=user,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=15),
        )

        if purpose in ("verify_email", "reset_password"):
            send_email(
                to_email=user.email,
                subject="Tasdiqlash kodi",
                template_name="otp_code",
                context={"code": code, "purpose": purpose},
            )

        return otp

    @staticmethod
    def verify_otp(user, code, purpose):
        try:
            otp = OTPCode.objects.get(
                user=user,
                code=code,
                purpose=purpose,
                is_used=False,
            )
        except OTPCode.DoesNotExist:
            return False

        if otp.is_expired:
            return False

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        if purpose == "verify_email":
            user.mark_email_verified()
        elif purpose == "verify_phone":
            user.mark_phone_verified()

        return True

    @staticmethod
    def reset_password(user, new_password):
        user.set_password(new_password)
        user.save(update_fields=["password"])
        OTPCode.objects.filter(user=user, purpose="reset_password", is_used=True).delete()
        return user

    @staticmethod
    def change_password(user, old_password, new_password):
        if not user.check_password(old_password):
            raise ValueError("Eski parol noto'g'ri")
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return user
