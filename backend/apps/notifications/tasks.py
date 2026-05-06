from celery import shared_task


@shared_task
def send_order_notification(order_id, status):
    from apps.orders.models import Order
    from apps.notifications.services import NotificationService

    try:
        order = Order.objects.get(id=order_id)
        NotificationService.create_notification(
            user=order.user,
            notification_type="order_status",
            title=f"Buyurtma holati: {status}",
            message=f"Buyurtma #{order.order_number} holati '{status}' ga o'zgartirildi.",
            data={"order_number": order.order_number, "status": status},
        )
    except Order.DoesNotExist:
        pass


@shared_task
def send_bulk_promo_email(user_ids, promo_id):
    from django.contrib.auth import get_user_model
    from apps.notifications.models import Notification
    from apps.orders.models import PromoCode

    User = get_user_model()
    try:
        promo = PromoCode.objects.get(id=promo_id)
    except PromoCode.DoesNotExist:
        return

    users = User.objects.filter(id__in=user_ids)
    notifications = [
        Notification(
            user=user,
            type="promo",
            title="Maxsus promo kod!",
            message=f"Siz uchun {promo.code} promo kodi: {promo.discount_value} {promo.discount_type}",
            data={"promo_code": promo.code},
        )
        for user in users
    ]
    Notification.objects.bulk_create(notifications)
    return f"Sent promo to {len(notifications)} users"


@shared_task
def send_otp_sms(phone, code):
    pass


@shared_task
def send_weekly_newsletter():
    from django.contrib.auth import get_user_model
    from apps.notifications.services import NotificationService

    User = get_user_model()
    users = User.objects.filter(is_active=True)[:100]
    for user in users:
        prefs = user.notification_preferences if hasattr(user, "notification_preferences") else None
        if prefs and prefs.email_promos:
            NotificationService.create_notification(
                user=user,
                notification_type="promo",
                title="Haftalik yangiliklar",
                message="Yangi kitoblar va maxsus takliflar!",
            )
    return f"Newsletter sent to {users.count()} users"
