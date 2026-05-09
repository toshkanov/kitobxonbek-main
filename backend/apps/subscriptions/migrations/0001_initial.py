import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="SubscriptionPlan",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "tier",
                    models.CharField(
                        choices=[
                            ("free", "Bepul"),
                            ("silver", "Kumush"),
                            ("tilla", "Tilla"),
                        ],
                        max_length=10,
                        unique=True,
                    ),
                ),
                ("slug", models.SlugField(max_length=50, unique=True)),
                (
                    "price_monthly",
                    models.DecimalField(decimal_places=2, default=0, max_digits=10),
                ),
                (
                    "price_yearly",
                    models.DecimalField(decimal_places=2, default=0, max_digits=10),
                ),
                ("description", models.TextField(blank=True)),
                (
                    "features",
                    models.JSONField(
                        default=list, help_text="Список возможностей плана"
                    ),
                ),
                ("ebook_access", models.BooleanField(default=False)),
                ("audiobook_access", models.BooleanField(default=False)),
                (
                    "download_limit",
                    models.PositiveIntegerField(
                        default=0, help_text="0 = cheksiz, N = oylik limit"
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "verbose_name": "Obuna rejasi",
                "verbose_name_plural": "Obuna rejalari",
                "db_table": "subscription_plans",
                "ordering": ["order", "price_monthly"],
            },
        ),
        migrations.CreateModel(
            name="UserSubscription",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "billing_cycle",
                    models.CharField(
                        choices=[("monthly", "Oylik"), ("yearly", "Yillik")],
                        default="monthly",
                        max_length=10,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("active", "Faol"),
                            ("expired", "Muddati o'tgan"),
                            ("cancelled", "Bekor qilingan"),
                            ("pending", "Kutilmoqda"),
                        ],
                        default="active",
                        max_length=20,
                    ),
                ),
                (
                    "started_at",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                ("expires_at", models.DateTimeField()),
                ("auto_renew", models.BooleanField(default=True)),
                ("cancelled_at", models.DateTimeField(blank=True, null=True)),
                (
                    "plan",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="subscribers",
                        to="subscriptions.subscriptionplan",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="subscription",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Foydalanuvchi obunasi",
                "verbose_name_plural": "Foydalanuvchi obunalari",
                "db_table": "user_subscriptions",
                "ordering": ["-started_at"],
            },
        ),
    ]
