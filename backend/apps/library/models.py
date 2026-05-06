import uuid
from django.db import models
from django.conf import settings

from apps.common.mixins import TimestampMixin


class UserLibrary(TimestampMixin):
    FORMAT_CHOICES = [
        ("ebook", "Elektron kitob"),
        ("audiobook", "Audio kitob"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="library")
    book = models.ForeignKey("catalog.Book", on_delete=models.CASCADE)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    purchased_at = models.DateTimeField(auto_now_add=True)
    download_count = models.PositiveIntegerField(default=0)
    last_read_position = models.JSONField(null=True, blank=True)
    is_favorite = models.BooleanField(default=False)

    class Meta:
        db_table = "user_library"
        unique_together = ("user", "book", "format")
        ordering = ["-purchased_at"]

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.format})"

    def increment_download(self):
        UserLibrary.objects.filter(pk=self.pk).update(download_count=models.F("download_count") + 1)


class ReadingProgress(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    library_item = models.OneToOneField(UserLibrary, on_delete=models.CASCADE, related_name="progress")
    current_page = models.PositiveIntegerField(null=True, blank=True)
    current_time_seconds = models.PositiveIntegerField(null=True, blank=True)
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    last_read_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "reading_progress"

    def __str__(self):
        return f"Progress for {self.library_item.book.title}"
