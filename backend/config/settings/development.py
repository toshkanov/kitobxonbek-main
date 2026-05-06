"""
Development settings for Kitobxonbek project.
Override base settings for local development.
"""

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
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

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
