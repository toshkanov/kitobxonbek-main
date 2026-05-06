from rest_framework import serializers
from apps.catalog.serializers import BookListSerializer


class RecommendationSerializer(serializers.Serializer):
    books = BookListSerializer(many=True)
    reason = serializers.CharField()
