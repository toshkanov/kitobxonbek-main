from rest_framework.views import exception_handler
from rest_framework.exceptions import (
    AuthenticationFailed,
    NotAuthenticated,
    PermissionDenied,
    ValidationError,
    NotFound,
)
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied as DjangoPermissionDenied
from django.db import IntegrityError


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, (ObjectDoesNotExist,)):
            return Response(
                {"error": "Topilmadi", "detail": str(exc)},
                status=404,
            )
        if isinstance(exc, (DjangoPermissionDenied,)):
            return Response(
                {"error": "Ruxsat yo'q", "detail": str(exc)},
                status=403,
            )
        if isinstance(exc, IntegrityError):
            return Response(
                {"error": "Ma'lumotlar xatosi", "detail": "Noto'g'ri ma'lumotlar"},
                status=400,
            )
        return Response(
            {"error": "Ichki server xatosi", "detail": str(exc)},
            status=500,
        )

    custom_data = {
        "error": _get_error_label(response.status_code),
        "status_code": response.status_code,
    }

    if isinstance(exc, ValidationError):
        custom_data["details"] = response.data
    elif isinstance(exc, (AuthenticationFailed, NotAuthenticated)):
        custom_data["detail"] = "Autentifikatsiya xatosi"
    elif isinstance(exc, PermissionDenied):
        custom_data["detail"] = "Ruxsat yo'q"
    elif isinstance(exc, NotFound):
        custom_data["detail"] = "Topilmadi"
    else:
        custom_data["detail"] = response.data.get("detail", str(response.data))

    response.data = custom_data
    return response


def _get_error_label(status_code):
    labels = {
        400: "Noto'g'ri so'rov",
        401: "Autentifikatsiya xatosi",
        403: "Ruxsat yo'q",
        404: "Topilmadi",
        405: "Ruxsat etilmagan metod",
        409: "Konflikt",
        429: "Limit oshgan",
        500: "Ichki server xatosi",
    }
    return labels.get(status_code, "Xatolik")
