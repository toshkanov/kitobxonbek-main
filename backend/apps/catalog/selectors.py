from django.db.models import Q, Prefetch, Count
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity

from apps.catalog.models import Book, Author, Genre, Publisher, BookCollection, Language, BookImage


def get_books_queryset():
    return (
        Book.objects.filter(is_published=True)
        .select_related("publisher", "language")
        .prefetch_related(
            "authors",
            "genres",
            Prefetch("images", queryset=BookImage.objects.order_by("order")),
        )
    )


def get_book_by_slug(slug):
    return (
        Book.objects.filter(is_published=True, slug=slug)
        .select_related("publisher", "language")
        .prefetch_related("authors", "genres", "images")
        .first()
    )


def get_featured_books():
    return get_books_queryset().filter(is_featured=True)[:20]


def get_bestsellers():
    return get_books_queryset().filter(is_bestseller=True).order_by("-sold_count")[:20]


def get_new_arrivals():
    # Frontend expects this endpoint to show the newest books.
    # Don't require the admin-only `is_new` flag, otherwise newly added
    # books won't appear until manually marked.
    return get_books_queryset().order_by("-created_at")[:20]


def get_related_books(book, limit=8):
    if not book:
        return Book.objects.none()

    genre_ids = book.genres.values_list("id", flat=True)
    author_ids = book.authors.values_list("id", flat=True)

    return (
        get_books_queryset()
        .filter(
            Q(genres__in=genre_ids) | Q(authors__in=author_ids),
        )
        .exclude(pk=book.pk)
        .annotate(
            genre_match=Count("genres", filter=Q(genres__in=genre_ids)),
            author_match=Count("authors", filter=Q(authors__in=author_ids)),
        )
        .order_by("-genre_match", "-author_match", "-sold_count")
        .distinct()[:limit]
    )


def filter_books(queryset, filters):
    genres = filters.get("genres")
    if genres:
        genre_slugs = genres.split(",")
        queryset = queryset.filter(genres__slug__in=genre_slugs)

    authors = filters.get("authors")
    if authors:
        author_ids = authors.split(",")
        queryset = queryset.filter(authors__id__in=author_ids)

    language = filters.get("language")
    if language:
        queryset = queryset.filter(language__code=language)

    price_min = filters.get("price_min")
    if price_min:
        queryset = queryset.filter(price__gte=price_min)

    price_max = filters.get("price_max")
    if price_max:
        queryset = queryset.filter(price__lte=price_max)

    has_ebook = filters.get("has_ebook")
    if has_ebook and has_ebook.lower() == "true":
        queryset = queryset.filter(has_ebook=True)

    has_audiobook = filters.get("has_audiobook")
    if has_audiobook and has_audiobook.lower() == "true":
        queryset = queryset.filter(has_audiobook=True)

    is_bestseller = filters.get("is_bestseller")
    if is_bestseller and is_bestseller.lower() == "true":
        queryset = queryset.filter(is_bestseller=True)

    rating_min = filters.get("rating_min")
    if rating_min:
        queryset = queryset.filter(average_rating__gte=rating_min)

    publication_year = filters.get("publication_year")
    if publication_year:
        queryset = queryset.filter(publication_date__year=publication_year)

    publisher = filters.get("publisher")
    if publisher:
        queryset = queryset.filter(publisher__slug=publisher)

    search = filters.get("search")
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search)
            | Q(description__icontains=search)
            | Q(authors__full_name__icontains=search)
        ).distinct()

    ordering = filters.get("ordering", "-created_at")
    queryset = queryset.order_by(ordering)

    return queryset.distinct()


def search_books(query):
    vector = SearchVector("title", weight="A") + SearchVector("description", weight="B")
    search_query = SearchQuery(query)

    return (
        get_books_queryset()
        .annotate(
            rank=SearchRank(vector, search_query),
        )
        .filter(rank__gte=0.1)
        .order_by("-rank")
    )


def get_search_suggestions(query):
    return (
        Book.objects.filter(is_published=True, title__icontains=query)
        .select_related("language")
        .prefetch_related("authors")[:10]
    )


def get_authors_queryset():
    return Author.objects.annotate(book_count=Count("books"))


def get_author_by_slug(slug):
    return Author.objects.filter(slug=slug).first()


def get_genres_tree():
    genres = Genre.objects.filter(parent=None).prefetch_related(
        Prefetch("children", queryset=Genre.objects.all(), to_attr="children_list")
    )
    return genres


def get_publishers_queryset():
    return Publisher.objects.annotate(book_count=Count("books"))


def get_collections_queryset():
    return BookCollection.objects.filter(is_featured=True).order_by("order")


def get_collection_by_slug(slug):
    return (
        BookCollection.objects.filter(slug=slug)
        .prefetch_related("books__authors", "books__images")
        .first()
    )
