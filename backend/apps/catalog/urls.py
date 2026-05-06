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
router.register(r"books", BookViewSet, basename="books")
router.register(r"authors", AuthorViewSet, basename="authors")
router.register(r"genres", GenreViewSet, basename="genres")
router.register(r"publishers", PublisherViewSet, basename="publishers")
router.register(r"collections", BookCollectionViewSet, basename="collections")
router.register(r"search", SearchViewSet, basename="search")

urlpatterns = [
    path("", include(router.urls)),
]
