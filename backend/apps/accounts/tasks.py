from datetime import timedelta
from django.utils import timezone
from celery import shared_task

from apps.accounts.models import OTPCode


@shared_task
def cleanup_old_otp_codes():
    threshold = timezone.now() - timedelta(hours=24)
    deleted, _ = OTPCode.objects.filter(
        expires_at__lt=threshold,
    ).delete()
    return f"Deleted {deleted} old OTP codes"


@shared_task
def send_welcome_email(user_id):
    from apps.accounts.models import User
    from apps.common.utils.helpers import send_email

    try:
        user = User.objects.get(id=user_id)
        send_email(
            to_email=user.email,
            subject="Kitobxon'ga xush kelibsiz!",
            template_name="welcome",
            context={"user": user},
        )
    except User.DoesNotExist:
        pass
