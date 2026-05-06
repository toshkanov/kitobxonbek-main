import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils import timezone

from apps.common.mixins import TimestampMixin
from apps.common.utils.slug import generate_order_number


class Cart(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cart",
    )
    session_key = models.CharField(max_length=40, null=True, blank=True)

    class Meta:
        db_table = "carts"

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Cart ({self.session_key})"

    @property
    def total_amount(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def clear(self):
        self.items.all().delete()


class CartItem(TimestampMixin):
    FORMAT_CHOICES = [
        ("paperback", "Qog'oz"),
        ("ebook", "Elektron"),
        ("audiobook", "Audio"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    book = models.ForeignKey("catalog.Book", on_delete=models.CASCADE)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES, default="paperback")
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "cart_items"
        unique_together = ("cart", "book", "format")

    def __str__(self):
        return f"{self.quantity}x {self.book.title}"

    @property
    def total_price(self):
        return self.book.effective_price * self.quantity

    @property
    def unit_price(self):
        return self.book.effective_price


class Wishlist(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist_items")
    book = models.ForeignKey("catalog.Book", on_delete=models.CASCADE)

    class Meta:
        db_table = "wishlists"
        unique_together = ("user", "book")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.book.title}"


class Order(TimestampMixin):
    STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("confirmed", "Tasdiqlangan"),
        ("processing", "Tayyorlanmoqda"),
        ("shipped", "Yo'lda"),
        ("delivered", "Yetkazilgan"),
        ("cancelled", "Bekor qilingan"),
        ("refunded", "Qaytarilgan"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("paid", "To'langan"),
        ("failed", "Xato"),
        ("refunded", "Qaytarilgan"),
    ]

    DELIVERY_METHOD_CHOICES = [
        ("pickup", "Olib ketish"),
        ("courier", "Kuryer"),
        ("post", "Pochta"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("click", "Click"),
        ("payme", "Payme"),
        ("cash", "Naqd"),
        ("card", "Karta"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=30, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")

    delivery_address = models.JSONField()
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD_CHOICES)
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonus_used = models.PositiveIntegerField(default=0)
    promo_code = models.ForeignKey("orders.PromoCode", on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True, default="")

    customer_note = models.TextField(blank=True)
    admin_note = models.TextField(blank=True)

    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["order_number"]),
            models.Index(fields=["status"]),
            models.Index(fields=["payment_status"]),
        ]

    def __str__(self):
        return self.order_number

    @property
    def is_cancelled(self):
        return self.status == "cancelled"

    @property
    def is_delivered(self):
        return self.status == "delivered"


class OrderItem(models.Model):
    FORMAT_CHOICES = [
        ("paperback", "Qog'oz"),
        ("ebook", "Elektron"),
        ("audiobook", "Audio"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    book = models.ForeignKey("catalog.Book", on_delete=models.PROTECT)
    book_title = models.CharField(max_length=300)
    book_price = models.DecimalField(max_digits=12, decimal_places=2)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "order_items"

    def __str__(self):
        return f"{self.quantity}x {self.book_title}"


class OrderStatusHistory(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=20)
    note = models.TextField(blank=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="order_status_changes",
    )

    class Meta:
        db_table = "order_status_history"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order.order_number} -> {self.status}"


class PromoCode(TimestampMixin):
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Foiz"),
        ("fixed", "Sobit summa"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=12, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "promo_codes"

    def __str__(self):
        return self.code

    @property
    def is_valid(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if now < self.valid_from or now > self.valid_until:
            return False
        if self.max_uses and self.used_count >= self.max_uses:
            return False
        return True

    def use(self):
        self.used_count += 1
        self.save(update_fields=["used_count"])
