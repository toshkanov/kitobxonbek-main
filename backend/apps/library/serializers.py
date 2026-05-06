from rest_framework import serializers
from apps.library.models import UserLibrary, ReadingProgress
from apps.catalog.serializers import BookListSerializer


class UserLibrarySerializer(serializers.ModelSerializer):
    book = BookListSerializer(read_only=True)

    class Meta:
        model = UserLibrary
        fields = [
            "id",
            "book",
            "format",
            "purchased_at",
            "download_count",
            "last_read_position",
            "is_favorite",
        ]


class ReadingProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingProgress
        fields = [
            "id",
            "current_page",
            "current_time_seconds",
            "progress_percentage",
            "last_read_at",
        ]


class ReadingProgressUpdateSerializer(serializers.Serializer):
    current_page = serializers.IntegerField(required=False)
    current_time_seconds = serializers.IntegerField(required=False)
    progress_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
