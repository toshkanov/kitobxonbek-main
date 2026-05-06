from django.contrib import admin
from apps.payments.models import Payment, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "provider", "transaction_id", "amount", "status", "paid_at")
    list_filter = ("provider", "status", "currency")
    search_fields = ("transaction_id", "order__order_number")


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ("payment", "amount", "status", "refunded_at")
    list_filter = ("status",)
    search_fields = ("payment__transaction_id", "reason")
