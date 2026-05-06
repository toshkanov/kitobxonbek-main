from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import (
    RegisterView,
    LoginView,
    LogoutView,
    VerifyEmailView,
    SendOTPView,
    VerifyOTPView,
    ForgotPasswordView,
    ResetPasswordView,
    ChangePasswordView,
    UserViewSet,
    AddressViewSet,
)

router = DefaultRouter()
router.register(r"me", UserViewSet, basename="user-me")
router.register(r"me/addresses", AddressViewSet, basename="user-addresses")

urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("verify-email/", VerifyEmailView.as_view(), name="auth-verify-email"),
    path("send-otp/", SendOTPView.as_view(), name="auth-send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="auth-verify-otp"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="auth-reset-password"),
    path("change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
]
