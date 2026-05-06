from django.contrib import admin
from django.utils.html import format_html

from apps.catalog.models import Author, Publisher, Genre, Language, Book, BookImage, BookCollection


class BookImageInline(admin.TabularInline):
    model = BookImage
    extra = 1
    fields = ("image", "is_primary", "order")


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("full_name", "nationality", "is_featured", "get_book_count")
    list_filter = ("is_featured", "nationality")
    search_fields = ("full_name", "bio")
    prepopulated_fields = {"slug": ("full_name",)}


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ("name", "website", "get_book_count")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

    def get_book_count(self, obj):
        return obj.books.count()
    get_book_count.short_description = "Kitoblar"


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "icon")
    list_filter = ("parent",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("code", "name")
    search_fields = ("name",)


class BookAuthorFilter(admin.SimpleListFilter):
    title = "muallif"
    parameter_name = "author"

    def lookups(self, request, model_admin):
        from apps.catalog.models import Author
        return [(a.id, a.full_name) for a in Author.objects.all()[:50]]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(authors__id=self.value())
        return queryset


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "isbn",
        "price",
        "discount_price",
        "stock_quantity",
        "average_rating",
        "is_published",
        "is_featured",
        "is_bestseller",
    )
    list_filter = (
        "is_published",
        "is_featured",
        "is_bestseller",
        "is_new",
        "has_ebook",
        "has_audiobook",
        "cover_type",
        "language",
        BookAuthorFilter,
    )
    search_fields = ("title", "isbn", "description")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("authors", "genres")
    inlines = [BookImageInline]
    readonly_fields = ("view_count", "sold_count", "average_rating", "review_count", "discount_percentage")


@admin.register(BookImage)
class BookImageAdmin(admin.ModelAdmin):
    list_display = ("book", "is_primary", "order")
    list_filter = ("is_primary",)


@admin.register(BookCollection)
class BookCollectionAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_featured", "order")
    list_filter = ("is_featured",)
    search_fields = ("title",)
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ("books",)
