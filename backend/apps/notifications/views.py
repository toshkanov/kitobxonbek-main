from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.notifications.models import Notification, NotificationPreference
from apps.notifications.serializers import NotificationSerializer, NotificationPreferenceSerializer
from apps.notifications.services import NotificationService


class NotificationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=False, methods=["get"])
    def unread(self, request):
        notifications = self.get_queryset().filter(is_read=False)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def count_unread(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"count": count})

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.mark_read()
        return Response({"message": "O'qildi deb belgilandi"})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"message": "Barchasi o'qildi deb belgilandi"})


class NotificationPreferenceViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationPreferenceSerializer

    def list(self, request):
        prefs = NotificationService.get_preferences(request.user)
        serializer = NotificationPreferenceSerializer(prefs)
        return Response(serializer.data)

    def partial_update(self, request):
        prefs = NotificationService.get_preferences(request.user)
        serializer = NotificationPreferenceSerializer(prefs, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
