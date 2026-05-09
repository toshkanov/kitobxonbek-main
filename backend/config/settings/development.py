"""
Development settings for Kitobxonbek project.
Override base settings for local development.
"""

import os
from .base import *  # noqa

# Security
DEBUG = True
SECRET_KEY = 'django-insecure-local-dev-key-not-for-production'
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'backend']

# Database (SQLite for development)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Install debug apps
INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]

# Debug toolbar middleware
MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

# Allow internal IPs for debug toolbar
INTERNAL_IPS = ['127.0.0.1', 'localhost']

# Email backend for development (console output)
# Use SMTP in development so OTP/verify emails can be delivered.
# Credentials should be provided via env vars:
#   EMAIL_HOST_USER, EMAIL_HOST_PASSWORD (for Gmail use an App Password)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True").lower() in ("1", "true", "yes")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "sherzodakramov0932@gmail.com")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "sherzodakramov0932@gmail.com")

# Cache: Use local memory cache for development
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-lock-file',
    }
}

# Celery: Use eager mode in development (execute tasks synchronously)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Logging: More verbose in development
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['root']['level'] = 'DEBUG'

# CORS: More permissive in development
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://0.0.0.0:8000',
]

# REST Framework: More detailed errors in development
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
]
REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'rest_framework.views.exception_handler'

# File storage: Local file system
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
