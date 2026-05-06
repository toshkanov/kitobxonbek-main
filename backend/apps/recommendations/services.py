from django.db.models import Count, Q
from apps.catalog.models import Book
from apps.catalog.selectors import get_books_queryset
from apps.recommendations.models import UserBookInteraction


class RecommendationService:
    @staticmethod
    def get_for_user(user, limit=10):
        interactions = UserBookInteraction.objects.filter(user=user)
        if not interactions.exists():
            return list(get_books_queryset().filter(is_featured=True)[:limit]), "Tanlangan kitoblar"

        viewed_books = interactions.filter(interaction_type="view").values_list("book_id", flat=True)
        purchased_books = interactions.filter(interaction_type="purchase").values_list("book_id", flat=True)

        viewed_genres = (
            Book.objects.filter(id__in=viewed_books)
            .values_list("genres__id", flat=True)
        )
        viewed_authors = (
            Book.objects.filter(id__in=viewed_books)
            .values_list("authors__id", flat=True)
        )

        recommendations = (
            get_books_queryset()
            .filter(
                Q(genres__id__in=viewed_genres) | Q(authors__id__in=viewed_authors),
                is_published=True,
            )
            .exclude(id__in=purchased_books)
            .annotate(
                genre_matches=Count("genres", filter=Q(genres__id__in=viewed_genres)),
                author_matches=Count("authors", filter=Q(authors__id__in=viewed_authors)),
            )
            .order_by("-genre_matches", "-author_matches", "-sold_count")
            .distinct()[:limit]
        )

        if not recommendations.exists():
            return list(get_books_queryset().filter(is_bestseller=True)[:limit]), "Bestsellerlar"

        return list(recommendations), "Sizga mos tavsiyalar"

    @staticmethod
    def get_similar_books(book_slug, limit=8):
        from apps.catalog.selectors import get_book_by_slug, get_related_books

        book = Book.objects.filter(slug=book_slug).first()
        if not book:
            return []
        return list(get_related_books(book, limit))

    @staticmethod
    def get_trending(limit=10):
        return list(
            get_books_queryset()
            .order_by("-view_count", "-sold_count")[:limit]
        )

    @staticmethod
    def record_interaction(user, book, interaction_type, score=1.0):
        UserBookInteraction.objects.create(
            user=user,
            book=book,
            interaction_type=interaction_type,
            score=score,
        )
