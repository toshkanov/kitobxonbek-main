"""
Celery configuration for Kitobxonbek project.
"""

import os
from celery import Celery
from celery.schedules import crontab

# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Create Celery app
app = Celery('kitobxonbek')

# Load configuration from Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks from all registered Django apps
app.autodiscover_tasks()

# Celery Beat Schedule
app.conf.beat_schedule = {
    # Order status sync - every 5 minutes
    'sync-order-status': {
        'task': 'apps.orders.tasks.sync_order_status',
        'schedule': crontab(minute='*/5'),
    },
    # Update bestseller stats - every hour
    'update-bestseller-stats': {
        'task': 'apps.catalog.tasks.update_bestseller_stats',
        'schedule': crontab(minute=0),  # Every hour
    },
    # Recalculate recommendations - daily at 3 AM
    'calculate-recommendations': {
        'task': 'apps.recommendations.tasks.calculate_recommendations',
        'schedule': crontab(hour=3, minute=0),
    },
    # Clean up old OTP codes - daily at 4 AM
    'cleanup-otp-codes': {
        'task': 'apps.accounts.tasks.cleanup_old_otp_codes',
        'schedule': crontab(hour=4, minute=0),
    },
    # Send weekly newsletter - every Monday at 9 AM
    'send-weekly-newsletter': {
        'task': 'apps.notifications.tasks.send_weekly_newsletter',
        'schedule': crontab(day_of_week=0, hour=9, minute=0),
    },
    # Check for stockouts - every 30 minutes
    'check-stockouts': {
        'task': 'apps.orders.tasks.check_stockout_alerts',
        'schedule': crontab(minute='*/30'),
    },
}


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
