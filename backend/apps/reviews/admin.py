from django.contrib import admin
from apps.reviews.models import Review, ReviewImage, ReviewVote, ReviewReply


class ReviewImageInline(admin.TabularInline):
    model = ReviewImage
    extra = 0


class ReviewReplyInline(admin.TabularInline):
    model = ReviewReply
    extra = 0


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("book", "user", "rating", "is_approved", "is_verified_purchase", "created_at")
    list_filter = ("rating", "is_approved", "is_verified_purchase")
    search_fields = ("book__title", "user__email", "title", "comment")
    inlines = [ReviewImageInline, ReviewReplyInline]


@admin.register(ReviewReply)
class ReviewReplyAdmin(admin.ModelAdmin):
    list_display = ("review", "user", "created_at")


@admin.register(ReviewVote)
class ReviewVoteAdmin(admin.ModelAdmin):
    list_display = ("review", "user", "is_helpful")
