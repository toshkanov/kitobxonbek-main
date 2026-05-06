from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from apps.accounts.models import User, Address, OTPCode


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "phone", "full_name", "role", "is_active", "created_at")
    list_filter = ("role", "is_active", "is_email_verified", "is_phone_verified")
    search_fields = ("email", "phone", "first_name", "last_name")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("email", "phone", "password")}),
        (_("Shaxsiy ma'lumotlar"), {"fields": ("first_name", "last_name", "avatar", "date_of_birth", "gender")}),
        (_("Verifikatsiya"), {"fields": ("is_email_verified", "is_phone_verified")}),
        (_("Rol va til"), {"fields": ("role", "language", "bonus_points")}),
        (_("Referral"), {"fields": ("referral_code", "referred_by")}),
        (_("Xavfsizlik"), {"fields": ("last_login_ip", "is_active", "is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "phone", "first_name", "last_name", "password1", "password2"),
            },
        ),
    )

    readonly_fields = ("referral_code", "last_login_ip", "created_at", "updated_at")


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "region", "district", "is_default")
    list_filter = ("region", "is_default")
    search_fields = ("user__email", "street")


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ("user", "code", "purpose", "is_used", "is_expired", "created_at")
    list_filter = ("purpose", "is_used")
    search_fields = ("user__email", "user__phone")
