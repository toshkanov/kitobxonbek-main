import hashlib
import hmac
import requests
from decimal import Decimal
from django.conf import settings
from django.utils import timezone

from apps.payments.models import Payment


class ClickService:
    @staticmethod
    def generate_prepare_data(order, trans_id):
        return {
            "click_trans_id": trans_id,
            "service_id": settings.CLICK_SERVICE_ID,
            "click_paydoc_id": str(order.id),
            "merchant_trans_id": str(order.order_number),
            "amount": str(order.total_amount),
            "action": 0,
            "sign_time": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
        }

    @staticmethod
    def verify_signature(params):
        secret_key = settings.CLICK_SECRET_KEY
        sign_string = f"{params.get('click_paydoc_id', '')}{params.get('service_id', '')}{params.get('click_trans_id', '')}{params.get('merchant_trans_id', '')}{params.get('amount', '')}{params.get('action', '')}{sign_time}{secret_key}"
        sign_string = params.get("sign_time", "") + secret_key
        expected = hashlib.md5(sign_string.encode()).hexdigest()
        return hmac.compare_digest(params.get("sign_time", ""), expected)

    @staticmethod
    def prepare(order):
        payment = Payment.objects.create(
            order=order,
            provider="click",
            transaction_id=f"click_{order.order_number}",
            amount=order.total_amount,
        )
        return payment

    @staticmethod
    def complete(payment, click_response):
        if click_response.get("error") == 0:
            payment.mark_success(click_response)
            payment.order.payment_status = "paid"
            payment.order.save(update_fields=["payment_status", "updated_at"])
        else:
            payment.mark_failed(click_response)
        return payment


class PaymeService:
    @staticmethod
    def verify_signature(headers, secret_key):
        auth_header = headers.get("Authorization", "")
        if not auth_header.startswith("Basic "):
            return False
        expected = f"{secret_key}:"
        encoded = hashlib.sha256(expected.encode()).hexdigest()
        return hmac.compare_digest(auth_header.split(" ")[1], encoded)

    @staticmethod
    def create_payment_intent(order):
        payment = Payment.objects.create(
            order=order,
            provider="payme",
            transaction_id=f"payme_{order.order_number}",
            amount=order.total_amount,
        )
        return payment

    @staticmethod
    def process_webhook(method, params):
        if method == "CheckPerformTransaction":
            return {"result": {"allow": True}}
        elif method == "CreateTransaction":
            order_number = params.get("account", {}).get("order_number")
            from apps.orders.models import Order
            try:
                order = Order.objects.get(order_number=order_number)
            except Order.DoesNotExist:
                return {"error": {"code": -32504, "message": "Order not found"}}
            return {
                "result": {
                    "create_time": int(timezone.now().timestamp() * 1000),
                    "transaction": params.get("id"),
                    "state": 1,
                }
            }
        elif method == "PerformTransaction":
            trans_id = params.get("id")
            payment = Payment.objects.filter(transaction_id=trans_id).first()
            if payment:
                payment.mark_success()
                payment.order.payment_status = "paid"
                payment.order.save(update_fields=["payment_status"])
            return {
                "result": {
                    "transaction": trans_id,
                    "perform_time": int(timezone.now().timestamp() * 1000),
                    "state": 2,
                }
            }
        elif method == "CancelTransaction":
            trans_id = params.get("id")
            payment = Payment.objects.filter(transaction_id=trans_id).first()
            if payment:
                payment.mark_failed()
            return {"result": {"transaction": trans_id, "state": -1}}
        return {"error": {"code": -32400, "message": "Unknown method"}}


class StripeService:
    @staticmethod
    def create_payment_intent(order):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        intent = stripe.PaymentIntent.create(
            amount=int(order.total_amount * 100),
            currency="usd",
            metadata={"order_number": order.order_number},
        )

        payment = Payment.objects.create(
            order=order,
            provider="stripe",
            transaction_id=intent.id,
            amount=order.total_amount,
            currency="USD",
        )
        return {"client_secret": intent.client_secret, "payment_id": payment.id}

    @staticmethod
    def handle_webhook(payload, sig_header):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            return None

        if event.type == "payment_intent.succeeded":
            intent = event.data.object
            order_number = intent.metadata.get("order_number")
            if order_number:
                from apps.orders.models import Order
                try:
                    order = Order.objects.get(order_number=order_number)
                    payment = Payment.objects.filter(order=order, provider="stripe").first()
                    if payment:
                        payment.mark_success({"stripe_event": event.id})
                        order.payment_status = "paid"
                        order.save(update_fields=["payment_status"])
                except Order.DoesNotExist:
                    pass
        return event
