from decimal import Decimal
from django.db import transaction
from django.utils import timezone

from apps.orders.models import Cart, CartItem, Wishlist, Order, OrderItem, PromoCode


class CartService:
    @staticmethod
    def get_or_create_cart(user=None, session_key=None):
        if user and user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=user)
        else:
            cart, _ = Cart.objects.get_or_create(session_key=session_key)
        return cart

    @staticmethod
    def add_item(cart, book, format="paperback", quantity=1):
        if not book.in_stock:
            raise ValueError("Kitob zaxirada yo'q")

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            book=book,
            format=format,
            defaults={"quantity": quantity},
        )

        if not created:
            new_quantity = item.quantity + quantity
            if new_quantity > book.stock_quantity:
                raise ValueError("Zaxirada yetarli emas")
            item.quantity = new_quantity
            item.save(update_fields=["quantity"])

        return item

    @staticmethod
    def update_item(item, quantity):
        if quantity <= 0:
            item.delete()
            return None
        if quantity > item.book.stock_quantity:
            raise ValueError("Zaxirada yetarli emas")
        item.quantity = quantity
        item.save(update_fields=["quantity"])
        return item

    @staticmethod
    def merge_carts(session_cart, user_cart):
        for item in session_cart.items.all():
            try:
                CartService.add_item(user_cart, item.book, item.format, item.quantity)
            except ValueError:
                pass
        session_cart.delete()
        return user_cart


class WishlistService:
    @staticmethod
    def toggle(user, book):
        item, created = Wishlist.objects.get_or_create(user=user, book=book)
        if not created:
            item.delete()
            return None, False
        return item, True


class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order(user, cart, data):
        subtotal = cart.total_amount

        discount_amount = Decimal(0)
        promo = None
        if data.get("promo_code"):
            try:
                promo = PromoCode.objects.get(code=data["promo_code"].upper())
                if promo.is_valid and subtotal >= promo.min_order_amount:
                    if promo.discount_type == "percentage":
                        discount_amount = subtotal * (promo.discount_value / 100)
                    else:
                        discount_amount = promo.discount_value
                    promo.use()
            except PromoCode.DoesNotExist:
                pass

        bonus_used = 0
        if data.get("use_bonus") and user.bonus_points > 0:
            max_bonus = min(user.bonus_points, subtotal)
            bonus_used = int(max_bonus)
            user.use_bonus_points(bonus_used)

        delivery_fee = Decimal(0)
        if data["delivery_method"] == "courier":
            delivery_fee = Decimal(30000)

        total_amount = subtotal - discount_amount - Decimal(bonus_used) + delivery_fee

        order = Order.objects.create(
            user=user,
            order_number=generate_order_number_for_order(),
            delivery_address=data["delivery_address"],
            delivery_method=data["delivery_method"],
            delivery_fee=delivery_fee,
            subtotal=subtotal,
            discount_amount=discount_amount,
            bonus_used=bonus_used,
            promo_code=promo,
            total_amount=total_amount,
            payment_method=data["payment_method"],
            customer_note=data.get("customer_note", ""),
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                book=item.book,
                book_title=item.book.title,
                book_price=item.unit_price,
                format=item.format,
                quantity=item.quantity,
                total_price=item.total_price,
            )
            item.book.decrement_stock(item.quantity)
            item.book.increment_sold(item.quantity)

        from apps.orders.models import OrderStatusHistory
        OrderStatusHistory.objects.create(
            order=order,
            status="pending",
            note="Buyurtma yaratildi",
        )

        cart.clear()
        return order


def generate_order_number_for_order():
    import random
    now = timezone.now()
    return f"KTB-{now.year}-{random.randint(1, 99999):05d}"
