from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count, Sum

from apps.catalog.models import Book


@shared_task
def update_bestseller_stats():
    threshold = timezone.now() - timedelta(days=30)
    top_books = (
        Book.objects.filter(is_published=True, created_at__gte=threshold)
        .annotate(total_sold=Sum("sold_count"))
        .order_by("-total_sold")[:20]
    )

    Book.objects.filter(is_bestseller=True).update(is_bestseller=False)
    for book in top_books:
        book.is_bestseller = True
        book.save(update_fields=["is_bestseller"])

    return f"Updated {top_books.count()} bestsellers"


@shared_task
def mark_new_arrivals():
    threshold = timezone.now() - timedelta(days=30)
    Book.objects.filter(
        is_published=True,
        created_at__gte=threshold,
    ).update(is_new=True)

    old_threshold = timezone.now() - timedelta(days=60)
    Book.objects.filter(
        is_published=True,
        created_at__lt=old_threshold,
    ).update(is_new=False)


@shared_task
def recalculate_ratings():
    from django.db.models import Avg
    from apps.reviews.models import Review

    books_with_reviews = (
        Review.objects.filter(is_approved=True)
        .values("book_id")
        .annotate(avg_rating=Avg("rating"), review_count=Count("id"))
    )

    for item in books_with_reviews:
        Book.objects.filter(id=item["book_id"]).update(
            average_rating=item["avg_rating"],
            review_count=item["review_count"],
        )

    return f"Recalculated ratings for {books_with_reviews.count()} books"
