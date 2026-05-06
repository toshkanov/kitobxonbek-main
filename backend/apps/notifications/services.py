from apps.notifications.models import Notification, NotificationPreference


class NotificationService:
    @staticmethod
    def create_notification(user, notification_type, title, message, data=None):
        return Notification.objects.create(
            user=user,
            type=notification_type,
            title=title,
            message=message,
            data=data or {},
        )

    @staticmethod
    def get_preferences(user):
        prefs, created = NotificationPreference.objects.get_or_create(user=user)
        return prefs
