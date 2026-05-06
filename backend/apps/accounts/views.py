from django.contrib.auth import get_user_model
from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.generics import GenericAPIView
from django.shortcuts import get_object_or_404

from apps.accounts.models import Address, OTPCode
from apps.accounts.serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
    AddressSerializer,
    AddressCreateSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from apps.accounts.services import AuthService
from apps.common.throttles import LoginRateThrottle, RegisterRateThrottle, AnonRateThrottle

User = get_user_model()


class RegisterView(GenericAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RegisterRateThrottle]

    def post(self, request):
        user, otp_code = AuthService.register(request.data)
        return Response(
            {
                "message": "Ro'yxatdan o'tildi. OTP kod yuborildi.",
                "user": UserSerializer(user).data,
                "otp_debug": otp_code,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = AuthService.authenticate(
            email=serializer.validated_data.get("email"),
            phone=serializer.validated_data.get("phone"),
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"error": "Email/telefon yoki parol noto'g'ri"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"error": "Hisob bloklangan"},
                status=status.HTTP_403_FORBIDDEN,
            )

        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(user).data,
            }
        )


class LogoutView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                from rest_framework_simplejwt.tokens import RefreshToken

                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            pass
        return Response({"message": "Muvaffaqiyatli chiqildi"})


class VerifyEmailView(GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = request.data.get("email")
        if not email:
            return Response({"error": "Email kiritilishi kerak"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        success = AuthService.verify_otp(
            user, serializer.validated_data["code"], serializer.validated_data["purpose"]
        )
        if success:
            return Response({"message": "Email tasdiqlandi"})
        return Response({"error": "Noto'g'ri yoki muddati o'tgan kod"}, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(GenericAPIView):
    serializer_class = SendOTPSerializer
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        phone = serializer.validated_data.get("phone")
        purpose = serializer.validated_data["purpose"]

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        elif phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Email yoki telefon kiritilishi kerak"}, status=status.HTTP_400_BAD_REQUEST)

        AuthService.send_otp(user, purpose)
        return Response({"message": "OTP kod yuborildi"})


class VerifyOTPView(GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = request.data.get("email")
        phone = request.data.get("phone")

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        elif phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Email yoki telefon kiritilishi kerak"}, status=status.HTTP_400_BAD_REQUEST)

        success = AuthService.verify_otp(
            user, serializer.validated_data["code"], serializer.validated_data["purpose"]
        )
        if success:
            return Response({"message": "Tasdiqlandi"})
        return Response({"error": "Noto'g'ri yoki muddati o'tgan kod"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        phone = serializer.validated_data.get("phone")

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"message": "Agar bunday foydalanuvchi mavjud bo'lsa, kod yuborildi"})
        elif phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({"message": "Agar bunday foydalanuvchi mavjud bo'lsa, kod yuborildi"})

        AuthService.send_otp(user, "reset_password")
        return Response({"message": "Parolni tiklash kodi yuborildi"})


class ResetPasswordView(GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = request.data.get("email")
        phone = request.data.get("phone")

        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
        elif phone:
            try:
                user = User.objects.get(phone=phone)
            except User.DoesNotExist:
                return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp = OTPCode.objects.get(
                user=user,
                code=serializer.validated_data["code"],
                purpose="reset_password",
                is_used=True,
            )
        except OTPCode.DoesNotExist:
            return Response({"error": "Noto'g'ri kod"}, status=status.HTTP_400_BAD_REQUEST)

        AuthService.reset_password(user, serializer.validated_data["new_password"])
        return Response({"message": "Parol muvaffaqiyatli o'zgartirildi"})


class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            AuthService.change_password(
                request.user,
                serializer.validated_data["old_password"],
                serializer.validated_data["new_password"],
            )
            return Response({"message": "Parol o'zgartirildi"})
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.action == "partial_update" or self.action == "update":
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=False, methods=["post"])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            AuthService.change_password(
                request.user,
                serializer.validated_data["old_password"],
                serializer.validated_data["new_password"],
            )
            return Response({"message": "Parol o'zgartirildi"})
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return AddressCreateSerializer
        return AddressSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
