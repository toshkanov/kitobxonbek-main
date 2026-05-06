from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.recommendations.services import RecommendationService
from apps.catalog.serializers import BookListSerializer


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=["get"])
    def for_you(self, request):
        if request.user.is_authenticated:
            books, reason = RecommendationService.get_for_user(request.user)
            RecommendationService.record_interaction(
                request.user, books[0], "view"
            ) if books else None
        else:
            books, reason = RecommendationService.get_trending(), "Trendda"

        return Response({
            "reason": reason,
            "books": BookListSerializer(books, many=True).data,
        })

    @action(detail=False, methods=["get"])
    def similar(self, request, book_slug=None):
        books = RecommendationService.get_similar_books(book_slug)
        return Response(BookListSerializer(books, many=True).data)

    @action(detail=False, methods=["get"])
    def trending(self, request):
        books = RecommendationService.get_trending()
        return Response(BookListSerializer(books, many=True).data)
