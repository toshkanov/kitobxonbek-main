from django.contrib import admin
from apps.notifications.models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "type", "title", "is_read", "created_at")
    list_filter = ("type", "is_read")
    search_fields = ("user__email", "title", "message")


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "email_orders", "email_promos", "sms_orders", "push_enabled")
    list_filter = ("email_orders", "email_promos", "sms_orders", "push_enabled")
    search_fields = ("user__email",)
