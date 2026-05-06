import uuid
import re

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.core.validators import MinLengthValidator

from apps.common.mixins import TimestampMixin
from apps.common.utils.slug import generate_referral_code


UZBEK_PHONE_REGEX = re.compile(r"^(\+998|998)?(9[0-49]|88|77|78|9[57]|91|93|95|97|98|99)\d{7}$")


class UserManager(BaseUserManager):
    def create_user(self, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError("Email majburiy")
        if not phone:
            raise ValueError("Telefon raqam majburiy")

        email = self.normalize_email(email)
        phone = phone.strip().replace("-", "").replace(" ", "")
        extra_fields.setdefault("role", "customer")
        extra_fields.setdefault("language", "uz")

        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.referral_code = generate_referral_code()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_email_verified", True)
        extra_fields.setdefault("is_phone_verified", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimestampMixin):
    ROLE_CHOICES = [
        ("customer", "Mijoz"),
        ("admin", "Admin"),
        ("moderator", "Moderator"),
    ]
    GENDER_CHOICES = [
        ("male", "Erkak"),
        ("female", "Ayol"),
    ]
    LANGUAGE_CHOICES = [
        ("uz", "O'zbek"),
        ("ru", "Rus"),
        ("en", "Ingliz"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(
        max_length=17,
        unique=True,
        validators=[MinLengthValidator(9)],
    )
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, blank=True, default="")
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="customer")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="uz")
    bonus_points = models.PositiveIntegerField(default=0)
    referral_code = models.CharField(max_length=10, unique=True)
    referred_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referred_users",
    )
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["role"]),
            models.Index(fields=["referral_code"]),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def mark_email_verified(self):
        self.is_email_verified = True
        self.save(update_fields=["is_email_verified"])

    def mark_phone_verified(self):
        self.is_phone_verified = True
        self.save(update_fields=["is_phone_verified"])

    def add_bonus_points(self, points):
        self.bonus_points += points
        self.save(update_fields=["bonus_points"])

    def use_bonus_points(self, points):
        if points > self.bonus_points:
            raise ValueError("Bonus yetarli emas")
        self.bonus_points -= points
        self.save(update_fields=["bonus_points"])


class Address(TimestampMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    title = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    street = models.CharField(max_length=200)
    house_number = models.CharField(max_length=20)
    apartment = models.CharField(max_length=20, blank=True)
    postal_code = models.CharField(max_length=10, blank=True)
    is_default = models.BooleanField(default=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
        db_table = "addresses"
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.title} - {self.street}, {self.house_number}"

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(
                is_default=False
            )
        super().save(*args, **kwargs)


class OTPCode(TimestampMixin):
    PURPOSE_CHOICES = [
        ("register", "Ro'yxatdan o'tish"),
        ("reset_password", "Parolni tiklash"),
        ("verify_phone", "Telefon tasdiqlash"),
        ("verify_email", "Email tasdiqlash"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otp_codes")
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = "otp_codes"
        ordering = ["-created_at"]

    def __str__(self):
        return f"OTP {self.code} for {self.user.email} ({self.purpose})"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired
