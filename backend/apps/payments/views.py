from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView

from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.serializers import PaymentSerializer
from apps.payments.services import ClickService, PaymeService, StripeService


class PaymentStatusView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get(self, request, pk):
        payment = Payment.objects.filter(
            id=pk, order__user=request.user
        ).first()
        if not payment:
            return Response({"error": "To'lov topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        return Response(PaymentSerializer(payment).data)


class ClickPrepareView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        order_number = request.data.get("order_number")
        try:
            order = Order.objects.get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({"error": "Buyurtma topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        payment = ClickService.prepare(order)
        return Response(
            {
                "payment_id": str(payment.id),
                "redirect_url": f"/payment/click/{payment.transaction_id}/",
            }
        )


class ClickCompleteView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({"message": "Click complete"})


class ClickWebhookView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        params = request.data
        action = params.get("action")

        if action == 0:
            return Response({
                "click_trans_param": params.get("click_trans_param"),
                "error": 0,
                "error_note": "Success",
            })
        elif action == 1:
            order_number = params.get("merchant_trans_id")
            try:
                order = Order.objects.get(order_number=order_number)
                payment = Payment.objects.filter(order=order, provider="click").first()
                if payment:
                    payment.mark_success(request.data)
                    order.payment_status = "paid"
                    order.save(update_fields=["payment_status", "updated_at"])
            except Order.DoesNotExist:
                pass

            return Response({
                "click_trans_param": params.get("click_trans_param"),
                "error": 0,
                "error_note": "Success",
            })

        return Response({"error": 1, "error_note": "Unknown action"})


class PaymeWebhookView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        method = request.data.get("method")
        params = request.data.get("params", {})
        result = PaymeService.process_webhook(method, params)
        return Response(result)


class StripeIntentView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_number = request.data.get("order_number")
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Buyurtma topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        try:
            result = StripeService.create_payment_intent(order)
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StripeWebhookView(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
        StripeService.handle_webhook(payload, sig_header)
        return Response({"received": True})
