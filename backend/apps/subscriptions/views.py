from datetime import timedelta

from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.subscriptions.models import SubscriptionPlan, UserSubscription
from apps.subscriptions.serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True).order_by("order")
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    pagination_class = None


class UserSubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_subscription(self, user):
        return (
            UserSubscription.objects.select_related("plan")
            .filter(user=user)
            .first()
        )

    def list(self, request):
        """GET /subscriptions/me/ — joriy obunani ko'rish"""
        obj = self._get_subscription(request.user)
        if not obj:
            return Response({"detail": "Obuna topilmadi."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSubscriptionSerializer(obj)
        return Response(serializer.data)

    def create(self, request):
        """POST /subscriptions/me/ — obuna yaratish yoki yangilash"""
        plan_id = request.data.get("plan_id")
        billing_cycle = request.data.get("billing_cycle", "monthly")

        plan_obj = SubscriptionPlan.objects.filter(pk=plan_id, is_active=True).first()
        if not plan_obj:
            return Response({"detail": "Reja topilmadi."}, status=status.HTTP_404_NOT_FOUND)

        duration_days = 365 if billing_cycle == "yearly" else 30
        expires_at = timezone.now() + timedelta(days=duration_days)

        subscription, created = UserSubscription.objects.update_or_create(
            user=request.user,
            defaults={
                "plan": plan_obj,
                "billing_cycle": billing_cycle,
                "status": "active",
                "started_at": timezone.now(),
                "expires_at": expires_at,
                "auto_renew": True,
                "cancelled_at": None,
            },
        )
        serializer = UserSubscriptionSerializer(subscription)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"])
    def cancel(self, request):
        """POST /subscriptions/me/cancel/ — obunani bekor qilish"""
        obj = self._get_subscription(request.user)
        if not obj:
            return Response({"detail": "Faol obuna yo'q."}, status=status.HTTP_404_NOT_FOUND)
        obj.cancel()
        return Response({"detail": "Obuna bekor qilindi."})
