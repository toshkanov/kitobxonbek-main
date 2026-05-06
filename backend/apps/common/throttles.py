from rest_framework.throttling import SimpleRateThrottle


class AnonRateThrottle(SimpleRateThrottle):
    scope = "anon"

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None
        return self.get_ident(request)


class UserRateThrottle(SimpleRateThrottle):
    scope = "user"

    def get_cache_key(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return None
        return f"throttle_user_{request.user.pk}"


class LoginRateThrottle(SimpleRateThrottle):
    scope = "login"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class RegisterRateThrottle(SimpleRateThrottle):
    scope = "register"

    def get_cache_key(self, request, view):
        return self.get_ident(request)
