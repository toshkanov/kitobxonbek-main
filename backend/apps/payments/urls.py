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
    path("<pk>/status/", PaymentStatusView.as_view(), name="payment-status"),
    path("click/prepare/", ClickPrepareView.as_view(), name="click-prepare"),
    path("click/complete/", ClickCompleteView.as_view(), name="click-complete"),
    path("click/webhook/", ClickWebhookView.as_view(), name="click-webhook"),
    path("payme/", PaymeWebhookView.as_view(), name="payme-webhook"),
    path("stripe/intent/", StripeIntentView.as_view(), name="stripe-intent"),
    path("stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
