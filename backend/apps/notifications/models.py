import uuid
from django.db import models
from django.conf import settings

from apps.common.mixins import TimestampMixin


class Notification(TimestampMixin):
    TYPE_CHOICES = [
        ("order_status", "Buyurtma holati"),
        ("promo", "Promo kod"),
        ("review_reply", "Sharh javobi"),
        ("welcome", "Xush kelibsiz"),
        ("system", "Tizim"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict)
    is_read = models.BooleanField(default=False)
    sent_email = models.BooleanField(default=False)
    sent_sms = models.BooleanField(default=False)
    sent_push = models.BooleanField(default=False)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["type"]),
        ]

    def __str__(self):
        return f"[{self.type}] {self.title}"

    def mark_read(self):
        self.is_read = True
        self.save(update_fields=["is_read", "updated_at"])


class NotificationPreference(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notification_preferences")
    email_orders = models.BooleanField(default=True)
    email_promos = models.BooleanField(default=True)
    sms_orders = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    telegram_chat_id = models.CharField(max_length=50, blank=True)

    class Meta:
        db_table = "notification_preferences"

    def __str__(self):
        return f"Preferences for {self.user.email}"
