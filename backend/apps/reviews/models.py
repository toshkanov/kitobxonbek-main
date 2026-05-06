import uuid
from django.db import models
from django.conf import settings

from apps.common.mixins import TimestampMixin


class Review(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey("catalog.Book", on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    helpful_count = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "reviews"
        unique_together = ("book", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.rating})"

    def increment_helpful(self):
        Review.objects.filter(pk=self.pk).update(helpful_count=models.F("helpful_count") + 1)

    def decrement_helpful(self):
        Review.objects.filter(pk=self.pk).update(helpful_count=models.F("helpful_count") - 1)


class ReviewImage(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="review_images/")

    class Meta:
        db_table = "review_images"


class ReviewVote(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_helpful = models.BooleanField()

    class Meta:
        db_table = "review_votes"
        unique_together = ("review", "user")


class ReviewReply(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="replies")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()

    class Meta:
        db_table = "review_replies"
        ordering = ["created_at"]

    def __str__(self):
        return f"Reply by {self.user.email}"
