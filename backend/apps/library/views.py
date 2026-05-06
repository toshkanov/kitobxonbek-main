from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.library.models import UserLibrary, ReadingProgress
from apps.library.serializers import (
    UserLibrarySerializer,
    ReadingProgressSerializer,
    ReadingProgressUpdateSerializer,
)


class UserLibraryViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = UserLibrarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserLibrary.objects.filter(user=self.request.user).select_related("book")

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        item = self.get_object()
        item.increment_download()

        book = item.book
        if item.format == "ebook" and book.ebook_file:
            return Response({"download_url": book.ebook_file.url})
        elif item.format == "audiobook" and book.audiobook_file:
            return Response({"download_url": book.audiobook_file.url})
        return Response({"error": "Fayl mavjud emas"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["post"])
    def progress(self, request, pk=None):
        item = self.get_object()
        serializer = ReadingProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        progress, created = ReadingProgress.objects.get_or_create(
            library_item=item,
            defaults=serializer.validated_data,
        )

        if not created:
            for key, value in serializer.validated_data.items():
                setattr(progress, key, value)
            progress.save(update_fields=list(serializer.validated_data.keys()) + ["updated_at"])

        return Response(ReadingProgressSerializer(progress).data)
