from django.contrib import admin
from apps.subscriptions.models import SubscriptionPlan, UserSubscription


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ["name", "tier", "price_monthly", "price_yearly", "is_active", "order"]
    list_editable = ["is_active", "order"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "plan", "billing_cycle", "status", "started_at", "expires_at"]
    list_filter = ["status", "billing_cycle", "plan"]
    raw_id_fields = ["user"]
