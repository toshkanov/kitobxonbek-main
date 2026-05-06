from decimal import Decimal
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from django.shortcuts import get_object_or_404

from apps.orders.models import Cart, CartItem, Wishlist, Order, PromoCode
from apps.orders.serializers import (
    CartSerializer,
    CartItemSerializer,
    CartItemCreateSerializer,
    WishlistSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    PromoCodeApplySerializer,
    OrderStatusHistorySerializer,
)
from apps.orders.services import CartService, WishlistService, OrderService
from apps.orders.selectors import get_user_orders, get_order_by_number


class CartViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    def get_cart(self, request):
        user = request.user if request.user.is_authenticated else None
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        return CartService.get_or_create_cart(user=user, session_key=session_key)

    def list(self, request):
        cart = self.get_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def items(self, request):
        cart = self.get_cart(request)
        serializer = CartItemCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            item = CartService.add_item(
                cart,
                serializer.validated_data["book"],
                serializer.validated_data.get("format", "paperback"),
                serializer.validated_data.get("quantity", 1),
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["patch"])
    def items_update(self, request):
        item_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        if not item_id or quantity is None:
            return Response({"error": "item_id va quantity kerak"}, status=status.HTTP_400_BAD_REQUEST)

        item = get_object_or_404(CartItem, id=item_id)
        try:
            item = CartService.update_item(item, int(quantity))
            if item is None:
                return Response({"message": "Olib tashlandi"})
            return Response(CartItemSerializer(item).data)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["delete"])
    def items_delete(self, request):
        item_id = request.query_params.get("item_id")
        if not item_id:
            return Response({"error": "item_id kerak"}, status=status.HTTP_400_BAD_REQUEST)
        CartItem.objects.filter(id=item_id).delete()
        return Response({"message": "Olib tashlandi"})

    @action(detail=False, methods=["post"])
    def clear(self, request):
        cart = self.get_cart(request)
        cart.clear()
        return Response({"message": "Savat tozalandi"})

    @action(detail=False, methods=["post"])
    def merge(self, request):
        if not request.user.is_authenticated:
            return Response({"error": "Autentifikatsiya kerak"}, status=status.HTTP_401_UNAUTHORIZED)
        session_key = request.session.session_key
        if not session_key:
            return Response({"message": "Savat yo'q"})

        try:
            session_cart = Cart.objects.get(session_key=session_key)
        except Cart.DoesNotExist:
            return Response({"message": "Savat yo'q"})

        user_cart = CartService.get_or_create_cart(user=request.user)
        CartService.merge_carts(session_cart, user_cart)
        return Response(CartSerializer(user_cart).data)

    @action(detail=False, methods=["post"])
    def apply_promo(self, request):
        cart = self.get_cart(request)
        serializer = PromoCodeApplySerializer(
            data={**request.data, "cart_total": cart.total_amount}
        )
        serializer.is_valid(raise_exception=True)
        promo = serializer.validated_data["promo"]

        discount = Decimal(0)
        if promo.discount_type == "percentage":
            discount = cart.total_amount * (promo.discount_value / 100)
        else:
            discount = promo.discount_value

        return Response(
            {
                "promo": promo.code,
                "discount_type": promo.discount_type,
                "discount_value": promo.discount_value,
                "discount_amount": discount,
                "new_total": cart.total_amount - discount,
            }
        )


class WishlistViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related("book")

    def list(self, request):
        serializer = WishlistSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def toggle(self, request, pk=None):
        from apps.catalog.models import Book

        book = get_object_or_404(Book, id=pk)
        item, created = WishlistService.toggle(request.user, book)

        if created:
            return Response(WishlistSerializer(item).data, status=status.HTTP_201_CREATED)
        return Response({"message": "Sevimlilardan olib tashlandi"})


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_user_orders(self.request.user)

    def get_object(self):
        return get_order_by_number(self.request.user, self.kwargs["pk"])

    def create(self, request):
        cart = CartService.get_or_create_cart(user=request.user)
        if not cart.items.exists():
            return Response({"error": "Savat bo'sh"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = OrderService.create_order(
                user=request.user,
                cart=cart,
                data=serializer.validated_data,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        from apps.orders.tasks import send_order_confirmation
        send_order_confirmation.delay(order.id)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in ("pending", "confirmed"):
            return Response({"error": "Buyurtmani bekor qilib bo'lmaydi"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "cancelled"
        order.save(update_fields=["status", "updated_at"])

        from apps.orders.models import OrderStatusHistory
        OrderStatusHistory.objects.create(
            order=order,
            status="cancelled",
            note="Foydalanuvchi tomonidan bekor qilindi",
            changed_by=request.user,
        )

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["get"])
    def track(self, request, pk=None):
        order = self.get_object()
        history = order.status_history.all().order_by("created_at")
        return Response(
            {
                "order_number": order.order_number,
                "status": order.status,
                "status_display": dict(Order.STATUS_CHOICES).get(order.status, ""),
                "history": OrderStatusHistorySerializer(history, many=True).data,
            }
        )
