"""
Main URL configuration for Kitobxonbek API.
Routes all API endpoints through /api/v1/
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation (OpenAPI/Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Routes (apps will add their own routes to /api/v1/)
    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.catalog.urls')),
    path('api/v1/', include('apps.orders.urls')),
    path('api/v1/', include('apps.payments.urls')),
    path('api/v1/', include('apps.reviews.urls')),
    path('api/v1/', include('apps.library.urls')),
    path('api/v1/', include('apps.notifications.urls')),
    path('api/v1/', include('apps.recommendations.urls')),
    path('api/v1/', include('apps.analytics.urls')),
    path('api/v1/', include('apps.common.urls')),
]

# Media files serving in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    # Debug toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
