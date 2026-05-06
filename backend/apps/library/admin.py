from django.contrib import admin
from apps.library.models import UserLibrary, ReadingProgress


@admin.register(UserLibrary)
class UserLibraryAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "format", "purchased_at", "download_count", "is_favorite")
    list_filter = ("format", "is_favorite")
    search_fields = ("user__email", "book__title")


@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ("library_item", "progress_percentage", "last_read_at")
    list_filter = ("last_read_at",)
