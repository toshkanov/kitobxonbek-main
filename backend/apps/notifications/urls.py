from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.notifications.views import NotificationViewSet, NotificationPreferenceViewSet

router = DefaultRouter()
router.register(r"notifications", NotificationViewSet, basename="notifications")

notification_preferences = NotificationPreferenceViewSet.as_view({
    "get": "list",
    "patch": "partial_update",
})

urlpatterns = [
    # Collection-level endpoint (no pk) for preferences.
    path("notification-preferences/", notification_preferences, name="notification-preferences"),
    path("", include(router.urls)),
]
