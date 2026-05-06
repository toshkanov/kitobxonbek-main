from rest_framework import serializers
from apps.catalog.models import Author, Publisher, Genre, Language, Book, BookImage, BookCollection


class AuthorSerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Author
        fields = [
            "id",
            "full_name",
            "slug",
            "bio",
            "photo",
            "birth_date",
            "nationality",
            "is_featured",
            "book_count",
        ]


class AuthorDetailSerializer(serializers.ModelSerializer):
    books = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = [
            "id",
            "full_name",
            "slug",
            "bio",
            "photo",
            "birth_date",
            "death_date",
            "nationality",
            "is_featured",
            "books",
        ]

    def get_books(self, obj):
        books = obj.books.filter(is_published=True)[:10]
        return BookListSerializer(books, many=True).data


class PublisherSerializer(serializers.ModelSerializer):
    book_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Publisher
        fields = ["id", "name", "slug", "logo", "website", "book_count"]


class GenreSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Genre
        fields = ["id", "name", "slug", "parent", "icon", "children"]

    def get_children(self, obj):
        if hasattr(obj, "children_list"):
            return GenreSerializer(obj.children_list, many=True).data
        return []


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "code", "name"]


class BookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookImage
        fields = ["id", "image", "is_primary", "order"]


class BookListSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "authors",
            "primary_image",
            "price",
            "discount_price",
            "discount_percentage",
            "effective_price",
            "stock_quantity",
            "in_stock",
            "average_rating",
            "review_count",
            "is_featured",
            "is_bestseller",
            "is_new",
            "has_ebook",
            "has_audiobook",
            "created_at",
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return BookImageSerializer(primary).data
        first_image = obj.images.first()
        if first_image:
            return BookImageSerializer(first_image).data
        return None


class BookDetailSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)
    publisher = PublisherSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    language = LanguageSerializer(read_only=True)
    images = BookImageSerializer(many=True, read_only=True)
    effective_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "slug",
            "isbn",
            "description",
            "short_description",
            "authors",
            "publisher",
            "genres",
            "language",
            "images",
            "price",
            "discount_price",
            "discount_percentage",
            "effective_price",
            "stock_quantity",
            "in_stock",
            "page_count",
            "cover_type",
            "weight_grams",
            "dimensions",
            "has_paperback",
            "has_ebook",
            "has_audiobook",
            "publication_date",
            "edition",
            "meta_title",
            "meta_description",
            "view_count",
            "sold_count",
            "average_rating",
            "review_count",
            "is_featured",
            "is_bestseller",
            "is_new",
            "created_at",
            "updated_at",
        ]


class BookCollectionSerializer(serializers.ModelSerializer):
    books = BookListSerializer(many=True, read_only=True)

    class Meta:
        model = BookCollection
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "cover_image",
            "books",
            "is_featured",
            "order",
        ]


class SearchSuggestionSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    slug = serializers.CharField()
    authors = serializers.CharField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
