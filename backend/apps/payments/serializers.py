from rest_framework import serializers
from apps.payments.models import Payment, Refund


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "provider",
            "transaction_id",
            "amount",
            "currency",
            "status",
            "paid_at",
            "created_at",
        ]


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = [
            "id",
            "payment",
            "amount",
            "reason",
            "status",
            "refunded_at",
            "created_at",
        ]
