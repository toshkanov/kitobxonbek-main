from django.core.management import call_command
from celery import shared_task


@shared_task
def clear_session():
    call_command("clearsessions")


@shared_task
def send_health_check_email():
    from django.core.mail import send_mail
    from django.conf import settings

    send_mail(
        "Kitobxon Health Check",
        "Backend is running.",
        settings.DEFAULT_FROM_EMAIL,
        [settings.DEFAULT_FROM_EMAIL],
    )
