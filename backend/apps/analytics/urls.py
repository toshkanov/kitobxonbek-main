from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.analytics.views import AdminStatsViewSet

router = DefaultRouter()
router.register(r"admin/stats", AdminStatsViewSet, basename="admin-stats")

urlpatterns = [
    path("", include(router.urls)),
]
