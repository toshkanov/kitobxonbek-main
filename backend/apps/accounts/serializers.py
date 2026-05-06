from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from datetime import timedelta

from apps.accounts.models import Address, OTPCode
from apps.common.utils.tokens import generate_otp_code

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    referral_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "email",
            "phone",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
            "gender",
            "date_of_birth",
            "referral_code",
        ]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Parollar mos kelmaydi"})
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        referral_code = validated_data.pop("referral_code", None)
        password = validated_data.pop("password")

        referred_by = None
        if referral_code:
            try:
                referred_by = User.objects.get(referral_code=referral_code)
            except User.DoesNotExist:
                pass

        user = User.objects.create_user(
            password=password,
            referred_by=referred_by,
            **validated_data,
        )

        otp = OTPCode.objects.create(
            user=user,
            code=generate_otp_code(),
            purpose="verify_email",
            expires_at=timezone.now() + timedelta(minutes=15),
        )
        user._otp_code = otp.code
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get("email") and not data.get("phone"):
            raise serializers.ValidationError("Email yoki telefon raqam kiritilishi kerak")
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "full_name",
            "avatar",
            "date_of_birth",
            "gender",
            "is_email_verified",
            "is_phone_verified",
            "role",
            "language",
            "bonus_points",
            "referral_code",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "is_email_verified",
            "is_phone_verified",
            "role",
            "bonus_points",
            "referral_code",
            "created_at",
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "avatar", "date_of_birth", "gender", "language"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Parollar mos kelmaydi"})
        return data


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "title",
            "region",
            "district",
            "street",
            "house_number",
            "apartment",
            "postal_code",
            "is_default",
            "latitude",
            "longitude",
        ]
        read_only_fields = ["id"]


class AddressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "title",
            "region",
            "district",
            "street",
            "house_number",
            "apartment",
            "postal_code",
            "is_default",
            "latitude",
            "longitude",
        ]


class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    purpose = serializers.ChoiceField(choices=OTPCode.PURPOSE_CHOICES)

    def validate(self, data):
        if not data.get("phone") and not data.get("email"):
            raise serializers.ValidationError("Telefon yoki email kiritilishi kerak")
        return data


class VerifyOTPSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=OTPCode.PURPOSE_CHOICES)


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)

    def validate(self, data):
        if not data.get("email") and not data.get("phone"):
            raise serializers.ValidationError("Email yoki telefon kiritilishi kerak")
        return data


class ResetPasswordSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Parollar mos kelmaydi"})
        return data
