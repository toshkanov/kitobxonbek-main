from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.library.views import UserLibraryViewSet

router = DefaultRouter()
router.register(r"library", UserLibraryViewSet, basename="library")

urlpatterns = [
    path("", include(router.urls)),
]
