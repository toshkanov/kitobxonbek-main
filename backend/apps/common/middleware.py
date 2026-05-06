import logging

from apps.common.utils.helpers import get_client_ip

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        logger.info(
            "%s %s %s %s",
            request.method,
            request.path,
            response.status_code,
            get_client_ip(request),
        )
        return response
