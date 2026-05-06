from django.db.models import Q, Prefetch
from apps.orders.models import Cart, CartItem, Wishlist, Order, PromoCode


def get_user_orders(user):
    return Order.objects.filter(user=user).prefetch_related("items").order_by("-created_at")


def get_order_by_number(user, order_number):
    return Order.objects.filter(user=user, order_number=order_number).prefetch_related(
        "items", "status_history"
    ).first()


def get_valid_promo_code(code, cart_total):
    try:
        promo = PromoCode.objects.get(code=code.upper())
        if promo.is_valid and cart_total >= promo.min_order_amount:
            return promo
    except PromoCode.DoesNotExist:
        pass
    return None
