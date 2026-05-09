from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.catalog.views import (
    BookViewSet,
    AuthorViewSet,
    GenreViewSet,
    PublisherViewSet,
    BookCollectionViewSet,
    SearchViewSet,
)

router = DefaultRouter()
# Keep a stable URL namespace that matches the frontend client.
# Django is mounted at /api/v1/, so these become:
#   /api/v1/catalog/books/, /api/v1/catalog/authors/, ...
router.register(r"catalog/books", BookViewSet, basename="catalog-books")
router.register(r"catalog/authors", AuthorViewSet, basename="catalog-authors")
router.register(r"catalog/genres", GenreViewSet, basename="catalog-genres")
router.register(r"catalog/publishers", PublisherViewSet, basename="catalog-publishers")
router.register(r"catalog/collections", BookCollectionViewSet, basename="catalog-collections")
router.register(r"catalog/search", SearchViewSet, basename="catalog-search")

urlpatterns = [
    path("", include(router.urls)),
]
