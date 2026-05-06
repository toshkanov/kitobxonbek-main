from decimal import Decimal
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta

from apps.analytics.serializers import StatsOverviewSerializer, SalesStatsSerializer, TopBookSerializer


class AdminStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"])
    def overview(self, request):
        from django.contrib.auth import get_user_model
        from apps.orders.models import Order
        from apps.catalog.models import Book

        User = get_user_model()
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(payment_status="paid").aggregate(
            total=Sum("total_amount")
        )["total"] or Decimal(0)
        total_books = Book.objects.filter(is_published=True).count()

        paid_orders = Order.objects.filter(payment_status="paid")
        avg_order = paid_orders.aggregate(avg=Avg("total_amount"))["avg"] or Decimal(0)

        conversion = 0
        if total_users > 0:
            buyers = Order.objects.values("user").distinct().count()
            conversion = round((buyers / total_users) * 100, 2)

        serializer = StatsOverviewSerializer({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_books": total_books,
            "avg_order_value": avg_order,
            "conversion_rate": conversion,
        })
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def sales(self, request):
        from apps.orders.models import Order

        period = request.query_params.get("period", "week")
        if period == "week":
            start = timezone.now() - timedelta(days=7)
        elif period == "month":
            start = timezone.now() - timedelta(days=30)
        else:
            start = timezone.now() - timedelta(days=365)

        orders = Order.objects.filter(created_at__gte=start, payment_status="paid")
        total_sales = orders.count()
        total_revenue = orders.aggregate(total=Sum("total_amount"))["total"] or Decimal(0)
        avg_order = orders.aggregate(avg=Avg("total_amount"))["avg"] or Decimal(0)

        serializer = SalesStatsSerializer({
            "period": period,
            "total_sales": total_sales,
            "total_revenue": total_revenue,
            "avg_order_value": avg_order,
        })
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def top_books(self, request):
        from apps.catalog.models import Book

        limit = int(request.query_params.get("limit", 10))
        books = (
            Book.objects.filter(is_published=True)
            .order_by("-sold_count")[:limit]
        )
        results = [
            {
                "id": b.id,
                "title": b.title,
                "slug": b.slug,
                "sold_count": b.sold_count,
                "view_count": b.view_count,
                "revenue": b.effective_price * b.sold_count,
            }
            for b in books
        ]
        serializer = TopBookSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def users(self, request):
        from django.contrib.auth import get_user_model
        from apps.orders.models import Order

        User = get_user_model()
        now = timezone.now()

        total = User.objects.count()
        new_this_week = User.objects.filter(created_at__gte=now - timedelta(days=7)).count()
        new_this_month = User.objects.filter(created_at__gte=now - timedelta(days=30)).count()
        active_buyers = Order.objects.values("user").distinct().count()

        return Response({
            "total": total,
            "new_this_week": new_this_week,
            "new_this_month": new_this_month,
            "active_buyers": active_buyers,
        })
