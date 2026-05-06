from decimal import Decimal
from rest_framework import serializers
from django.conf import settings

from apps.orders.models import Cart, CartItem, Wishlist, Order, OrderItem, OrderStatusHistory, PromoCode


class CartItemSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_slug = serializers.CharField(source="book.slug", read_only=True)
    book_image = serializers.SerializerMethodField()
    unit_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "book",
            "book_title",
            "book_slug",
            "book_image",
            "format",
            "quantity",
            "unit_price",
            "total_price",
            "added_at",
        ]

    def get_book_image(self, obj):
        primary = obj.book.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url
        first = obj.book.images.first()
        if first:
            return first.image.url
        return None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total_amount", "total_items", "created_at", "updated_at"]


class CartItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ["book", "format", "quantity"]

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Miqtar 1 dan kam bo'lmasligi kerak")
        return value

    def validate(self, data):
        book = data.get("book")
        if book and not book.in_stock:
            raise serializers.ValidationError("Kitob zaxirada yo'q")
        if book and data.get("quantity", 0) > book.stock_quantity:
            raise serializers.ValidationError("Zaxirada yetarli emas")
        return data


class WishlistSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source="book.title", read_only=True)
    book_slug = serializers.CharField(source="book.slug", read_only=True)
    book_price = serializers.DecimalField(source="book.effective_price", max_digits=12, decimal_places=2, read_only=True)
    book_image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ["id", "book", "book_title", "book_slug", "book_price", "book_image", "added_at"]

    def get_book_image(self, obj):
        primary = obj.book.images.filter(is_primary=True).first()
        if primary:
            return primary.image.url
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "book", "book_title", "book_price", "format", "quantity", "total_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "delivery_address",
            "delivery_method",
            "delivery_fee",
            "subtotal",
            "discount_amount",
            "bonus_used",
            "total_amount",
            "status",
            "payment_status",
            "payment_method",
            "customer_note",
            "items",
            "created_at",
            "updated_at",
            "delivered_at",
        ]


class OrderCreateSerializer(serializers.Serializer):
    delivery_method = serializers.ChoiceField(choices=Order.DELIVERY_METHOD_CHOICES)
    delivery_address = serializers.JSONField()
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_METHOD_CHOICES)
    promo_code = serializers.CharField(required=False, allow_blank=True)
    use_bonus = serializers.BooleanField(default=False)
    customer_note = serializers.CharField(required=False, allow_blank=True)


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.full_name", read_only=True, default="")

    class Meta:
        model = OrderStatusHistory
        fields = ["id", "status", "note", "changed_by_name", "created_at"]


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = ["id", "code", "discount_type", "discount_value", "min_order_amount", "is_valid"]


class PromoCodeApplySerializer(serializers.Serializer):
    code = serializers.CharField()
    cart_total = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate(self, data):
        try:
            promo = PromoCode.objects.get(code=data["code"].upper())
        except PromoCode.DoesNotExist:
            raise serializers.ValidationError({"code": "Promo kod topilmadi"})

        if not promo.is_valid:
            raise serializers.ValidationError({"code": "Promo kod yaroqsiz"})

        if data["cart_total"] < promo.min_order_amount:
            raise serializers.ValidationError(
                {"code": f"Minimal buyurtma summasi: {promo.min_order_amount}"}
            )

        data["promo"] = promo
        return data
