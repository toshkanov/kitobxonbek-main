import uuid
from django.db import models
from django.conf import settings

from apps.common.mixins import TimestampMixin


class PageView(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    session_key = models.CharField(max_length=40)
    page_url = models.CharField(max_length=500)
    book = models.ForeignKey("catalog.Book", on_delete=models.SET_NULL, null=True)
    referrer = models.CharField(max_length=500, blank=True)
    user_agent = models.CharField(max_length=500)
    ip = models.GenericIPAddressField()
    country = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = "page_views"
        indexes = [
            models.Index(fields=["created_at"]),
            models.Index(fields=["book"]),
            models.Index(fields=["session_key"]),
        ]

    def __str__(self):
        return f"{self.page_url} - {self.ip}"


class SearchQuery(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    query = models.CharField(max_length=300)
    results_count = models.PositiveIntegerField()
    clicked_book = models.ForeignKey("catalog.Book", on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = "search_queries"
        indexes = [models.Index(fields=["created_at"])]

    def __str__(self):
        return self.query
