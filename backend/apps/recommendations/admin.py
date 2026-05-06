from django.contrib import admin
from apps.recommendations.models import UserBookInteraction


@admin.register(UserBookInteraction)
class UserBookInteractionAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "interaction_type", "score", "created_at")
    list_filter = ("interaction_type",)
    search_fields = ("user__email", "book__title")
