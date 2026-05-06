from rest_framework import serializers


class StatsOverviewSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_books = serializers.IntegerField()
    avg_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    conversion_rate = serializers.FloatField()


class SalesStatsSerializer(serializers.Serializer):
    period = serializers.CharField()
    total_sales = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    avg_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)


class TopBookSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    slug = serializers.CharField()
    sold_count = serializers.IntegerField()
    view_count = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
