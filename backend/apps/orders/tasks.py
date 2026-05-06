from celery import shared_task
from django.utils import timezone
from datetime import timedelta

from apps.orders.models import Order


@shared_task
def send_order_confirmation(order_id):
    from apps.orders.models import Order
    from apps.common.utils.helpers import send_email

    try:
        order = Order.objects.get(id=order_id)
        send_email(
            to_email=order.user.email,
            subject=f"Buyurtma tasdiqlandi: {order.order_number}",
            template_name="order_confirmation",
            context={"order": order},
        )
    except Order.DoesNotExist:
        pass


@shared_task
def sync_order_status():
    orders = Order.objects.filter(status__in=["shipped", "processing"])
    for order in orders:
        pass
    return f"Checked {orders.count()} orders"


@shared_task
def check_stockout_alerts():
    from apps.catalog.models import Book
    low_stock = Book.objects.filter(stock_quantity__lte=5, is_published=True)
    if low_stock.exists():
        from django.conf import settings
        from django.core.mail import send_mail

        book_list = "\n".join([f"- {b.title} ({b.stock_quantity})" for b in low_stock[:20]])
        send_mail(
            "Past zaxira ogohlantirishi",
            f"Quyidagi kitoblar zaxirasi kam:\n\n{book_list}",
            settings.DEFAULT_FROM_EMAIL,
            [settings.DEFAULT_FROM_EMAIL],
        )
    return f"Found {low_stock.count()} low stock items"


@shared_task
def send_cart_abandoned_notifications():
    from apps.orders.models import Cart
    from django.utils import timezone
    from datetime import timedelta

    threshold = timezone.now() - timedelta(hours=24)
    abandoned_carts = Cart.objects.filter(
        updated_at__lt=threshold,
        user__isnull=False,
    ).select_related("user")

    for cart in abandoned_carts:
        if cart.items.exists():
            pass
    return f"Checked {abandoned_carts.count()} abandoned carts"
