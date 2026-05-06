import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings

from apps.common.mixins import TimestampMixin


class Payment(TimestampMixin):
    PROVIDER_CHOICES = [
        ("click", "Click"),
        ("payme", "Payme"),
        ("stripe", "Stripe"),
        ("cash", "Naqd"),
    ]

    STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("success", "Muvaffaqiyatli"),
        ("failed", "Xato"),
        ("cancelled", "Bekor qilingan"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey("orders.Order", on_delete=models.PROTECT, related_name="payments")
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    transaction_id = models.CharField(max_length=200, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="UZS")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    provider_response = models.JSONField(default=dict)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "payments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.provider} - {self.transaction_id}"

    def mark_success(self, provider_response=None):
        self.status = "success"
        self.paid_at = timezone.now()
        if provider_response:
            self.provider_response = provider_response
        self.save(update_fields=["status", "paid_at", "provider_response", "updated_at"])

    def mark_failed(self, provider_response=None):
        self.status = "failed"
        if provider_response:
            self.provider_response = provider_response
        self.save(update_fields=["status", "provider_response", "updated_at"])


class Refund(TimestampMixin):
    STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("approved", "Tasdiqlangan"),
        ("processing", "Qaytarilmoqda"),
        ("completed", "Qaytarildi"),
        ("rejected", "Rad etildi"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name="refunds")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="processed_refunds",
    )
    refunded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "refunds"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Refund {self.id} for {self.payment.transaction_id}"
