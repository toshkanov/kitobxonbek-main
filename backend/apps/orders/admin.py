from django.contrib import admin
from django.utils.html import format_html

from apps.orders.models import Cart, CartItem, Wishlist, Order, OrderItem, OrderStatusHistory, PromoCode


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("book_title", "book_price", "format", "quantity", "total_price")


class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ("status", "note", "changed_by", "created_at")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "order_number",
        "user",
        "total_amount",
        "status",
        "payment_status",
        "payment_method",
        "created_at",
    )
    list_filter = ("status", "payment_status", "payment_method", "delivery_method")
    search_fields = ("order_number", "user__email", "user__phone")
    readonly_fields = (
        "order_number",
        "subtotal",
        "discount_amount",
        "bonus_used",
        "delivery_fee",
        "total_amount",
        "created_at",
        "updated_at",
    )
    inlines = [OrderItemInline, OrderStatusHistoryInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "book_title", "quantity", "total_price")


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_type", "discount_value", "used_count", "max_uses", "is_active")
    list_filter = ("discount_type", "is_active")
    search_fields = ("code",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "session_key", "total_items", "total_amount")
    search_fields = ("user__email",)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "book", "created_at")
    search_fields = ("user__email", "book__title")
