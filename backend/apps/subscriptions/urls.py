from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.subscriptions.views import SubscriptionPlanViewSet, UserSubscriptionViewSet

router = DefaultRouter()
router.register(r"subscriptions/plans", SubscriptionPlanViewSet, basename="subscription-plans")
router.register(r"subscriptions/me", UserSubscriptionViewSet, basename="user-subscription")

urlpatterns = [
    path("", include(router.urls)),
]
