from django.urls import path

from apps.payments.views import (
    PaymentStatusView,
    ClickPrepareView,
    ClickCompleteView,
    ClickWebhookView,
    PaymeWebhookView,
    StripeIntentView,
    StripeWebhookView,
)

urlpatterns = [
    # Namespaced under /api/v1/payments/...
    path("payments/<uuid:pk>/status/", PaymentStatusView.as_view(), name="payment-status"),
    path("payments/click/prepare/", ClickPrepareView.as_view(), name="click-prepare"),
    path("payments/click/complete/", ClickCompleteView.as_view(), name="click-complete"),
    path("payments/click/webhook/", ClickWebhookView.as_view(), name="click-webhook"),
    path("payments/payme/", PaymeWebhookView.as_view(), name="payme-webhook"),
    path("payments/stripe/intent/", StripeIntentView.as_view(), name="stripe-intent"),
    path("payments/stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
