import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings

from apps.common.mixins import TimestampMixin


class SubscriptionPlan(TimestampMixin):
    TIER_CHOICES = [
        ("free", "Bepul"),
        ("silver", "Kumush"),
        ("tilla", "Tilla"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    tier = models.CharField(max_length=10, choices=TIER_CHOICES, unique=True)
    slug = models.SlugField(unique=True, max_length=50)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, help_text="Список возможностей плана")
    ebook_access = models.BooleanField(default=False)
    audiobook_access = models.BooleanField(default=False)
    download_limit = models.PositiveIntegerField(
        default=0, help_text="0 = cheksiz, N = oylik limit"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "subscription_plans"
        ordering = ["order", "price_monthly"]
        verbose_name = "Obuna rejasi"
        verbose_name_plural = "Obuna rejalari"

    def __str__(self):
        return self.name


class UserSubscription(TimestampMixin):
    BILLING_CHOICES = [
        ("monthly", "Oylik"),
        ("yearly", "Yillik"),
    ]
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("expired", "Muddati o'tgan"),
        ("cancelled", "Bekor qilingan"),
        ("pending", "Kutilmoqda"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription",
    )
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.PROTECT,
        related_name="subscribers",
    )
    billing_cycle = models.CharField(max_length=10, choices=BILLING_CHOICES, default="monthly")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    started_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    auto_renew = models.BooleanField(default=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "user_subscriptions"
        ordering = ["-started_at"]
        verbose_name = "Foydalanuvchi obunasi"
        verbose_name_plural = "Foydalanuvchi obunalari"

    def __str__(self):
        return f"{self.user} — {self.plan.name}"

    @property
    def is_active(self):
        return self.status == "active" and timezone.now() < self.expires_at

    def cancel(self):
        self.status = "cancelled"
        self.auto_renew = False
        self.cancelled_at = timezone.now()
        self.save(update_fields=["status", "auto_renew", "cancelled_at", "updated_at"])
