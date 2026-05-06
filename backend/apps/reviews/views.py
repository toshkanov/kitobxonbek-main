from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from django.shortcuts import get_object_or_404

from apps.reviews.models import Review, ReviewImage, ReviewVote, ReviewReply
from apps.reviews.serializers import (
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewVoteSerializer,
    ReviewReplySerializer,
)
from apps.common.permissions import IsOwnerOrReadOnly


class BookReviewViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Review.objects.filter(book__slug=self.kwargs["book_slug"], is_approved=True)
            .select_related("user")
            .prefetch_related("images", "replies")
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.action == "create":
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        from apps.catalog.models import Book

        book = get_object_or_404(Book, slug=self.kwargs["book_slug"])
        instance = serializer.save(
            book=book,
            user=self.request.user,
        )
        return instance

    def get_serializer_context(self):
        context = super().get_serializer_context()
        from apps.catalog.models import Book

        context["book"] = get_object_or_404(Book, slug=self.kwargs.get("book_slug"))
        return context


class ReviewViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Review.objects.all().select_related("user").prefetch_related("images", "replies")
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    @action(detail=True, methods=["post"])
    def vote(self, request, pk=None):
        serializer = ReviewVoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        review = self.get_object()
        vote, created = ReviewVote.objects.get_or_create(
            review=review,
            user=request.user,
            defaults={"is_helpful": serializer.validated_data["is_helpful"]},
        )

        if not created:
            vote.is_helpful = serializer.validated_data["is_helpful"]
            vote.save(update_fields=["is_helpful"])

        if vote.is_helpful:
            review.increment_helpful()
        else:
            review.decrement_helpful()

        return Response({"helpful_count": review.helpful_count})

    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        review = self.get_object()
        serializer = ReviewReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reply = serializer.save(review=review, user=request.user)
        return Response(ReviewReplySerializer(reply).data, status=status.HTTP_201_CREATED)
