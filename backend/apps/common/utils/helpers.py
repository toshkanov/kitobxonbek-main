from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_email(to_email, subject, template_name, context=None, from_email=None):
    if context is None:
        context = {}
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    html_content = render_to_string(f"emails/{template_name}.html", context)
    text_content = render_to_string(f"emails/{template_name}.txt", context)

    email = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
    email.attach_alternative(html_content, "text/html")
    email.send()


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip
