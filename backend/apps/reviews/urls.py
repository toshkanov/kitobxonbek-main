from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.reviews.views import BookReviewViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet, basename="reviews")

book_review_list_create = BookReviewViewSet.as_view({
    "get": "list",
    "post": "create",
})

urlpatterns = [
    # Book-scoped reviews:
    #   GET  /api/v1/books/<book_slug>/reviews/
    #   POST /api/v1/books/<book_slug>/reviews/
    path("books/<slug:book_slug>/reviews/", book_review_list_create, name="book-reviews"),
    # Review detail actions:
    #   /api/v1/reviews/<id>/ ...
    path("", include(router.urls)),
]
