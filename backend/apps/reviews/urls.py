from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.reviews.views import BookReviewViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet, basename="reviews")

urlpatterns = []
