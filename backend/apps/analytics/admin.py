from django.contrib import admin
from apps.analytics.models import PageView, SearchQuery


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ("page_url", "user", "ip", "created_at")
    list_filter = ("country",)
    search_fields = ("page_url", "user_agent", "ip")


@admin.register(SearchQuery)
class SearchQueryAdmin(admin.ModelAdmin):
    list_display = ("query", "user", "results_count", "clicked_book", "created_at")
    search_fields = ("query",)
