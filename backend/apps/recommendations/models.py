import uuid
from django.db import models
from django.conf import settings

from apps.common.mixins import TimestampMixin


class UserBookInteraction(TimestampMixin):
    INTERACTION_TYPES = [
        ("view", "Ko'rish"),
        ("purchase", "Xarid"),
        ("wishlist", "Sevimli"),
        ("review", "Sharh"),
        ("read", "O'qish"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="book_interactions")
    book = models.ForeignKey("catalog.Book", on_delete=models.CASCADE)
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    score = models.DecimalField(max_digits=3, decimal_places=2, default=1.0)

    class Meta:
        db_table = "user_book_interactions"
        indexes = [
            models.Index(fields=["user", "interaction_type"]),
            models.Index(fields=["book"]),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.interaction_type})"
