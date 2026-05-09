from rest_framework import serializers
from apps.subscriptions.models import SubscriptionPlan, UserSubscription


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "tier",
            "slug",
            "price_monthly",
            "price_yearly",
            "description",
            "features",
            "ebook_access",
            "audiobook_access",
            "download_limit",
        ]


class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.filter(is_active=True),
        source="plan",
        write_only=True,
    )
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "plan",
            "plan_id",
            "billing_cycle",
            "status",
            "started_at",
            "expires_at",
            "auto_renew",
            "is_active",
        ]
        read_only_fields = ["status", "started_at", "expires_at", "is_active"]
