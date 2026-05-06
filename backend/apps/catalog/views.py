from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.catalog.models import Author, Publisher, Genre, Language, Book, BookCollection
from apps.catalog.serializers import (
    AuthorSerializer,
    AuthorDetailSerializer,
    PublisherSerializer,
    GenreSerializer,
    LanguageSerializer,
    BookListSerializer,
    BookDetailSerializer,
    BookCollectionSerializer,
    SearchSuggestionSerializer,
)
from apps.catalog.selectors import (
    get_books_queryset,
    get_book_by_slug,
    get_featured_books,
    get_bestsellers,
    get_new_arrivals,
    get_related_books,
    filter_books,
    search_books,
    get_search_suggestions,
    get_authors_queryset,
    get_author_by_slug,
    get_genres_tree,
    get_publishers_queryset,
    get_collections_queryset,
    get_collection_by_slug,
)
from apps.common.permissions import IsAdminOrReadOnly


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_featured", "is_bestseller", "is_new", "has_ebook", "has_audiobook", "language"]
    search_fields = ["title", "description", "authors__full_name"]
    ordering_fields = ["created_at", "price", "sold_count", "average_rating", "view_count"]
    ordering = ["-created_at"]
    throttle_classes = [AnonRateThrottle]

    def get_queryset(self):
        queryset = get_books_queryset()
        filters = {k: v for k, v in self.request.query_params.items() if v}
        return filter_books(queryset, filters)

    def retrieve(self, request, *args, **kwargs):
        instance = get_book_by_slug(kwargs["slug"])
        if not instance:
            from rest_framework.exceptions import NotFound
            raise NotFound("Kitob topilmadi")
        instance.increment_views()
        serializer = BookDetailSerializer(instance)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookDetailSerializer
        return BookListSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        books = get_featured_books()
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def bestsellers(self, request):
        books = get_bestsellers()
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def new_arrivals(self, request):
        books = get_new_arrivals()
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def related(self, request, slug=None):
        book = get_book_by_slug(slug)
        if not book:
            from rest_framework.exceptions import NotFound
            raise NotFound("Kitob topilmadi")
        related = get_related_books(book)
        serializer = BookListSerializer(related, many=True)
        return Response(serializer.data)


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def get_queryset(self):
        return get_authors_queryset().order_by("full_name")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return AuthorDetailSerializer
        return AuthorSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = get_author_by_slug(kwargs["slug"])
        if not instance:
            from rest_framework.exceptions import NotFound
            raise NotFound("Muallif topilmadi")
        serializer = AuthorDetailSerializer(instance)
        return Response(serializer.data)


class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        genres = get_genres_tree()
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)


class PublisherViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def get_queryset(self):
        return get_publishers_queryset().order_by("name")


class BookCollectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BookCollection.objects.all()
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]
    lookup_field = "slug"

    def get_queryset(self):
        return get_collections_queryset()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BookCollectionSerializer
        return BookCollectionSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = get_collection_by_slug(kwargs["slug"])
        if not instance:
            from rest_framework.exceptions import NotFound
            raise NotFound("To'plam topilmadi")
        serializer = BookCollectionSerializer(instance)
        return Response(serializer.data)


class SearchViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def list(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response([])
        books = search_books(query)
        serializer = BookListSerializer(books, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def suggestions(self, request):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response([])
        books = get_search_suggestions(query)
        results = [
            {
                "id": book.id,
                "title": book.title,
                "slug": book.slug,
                "authors": ", ".join([a.full_name for a in book.authors.all()]),
                "price": book.price,
            }
            for book in books
        ]
        return Response(results)
