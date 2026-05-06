import random
from django.core.signing import TimestampSigner


signer = TimestampSigner()


def generate_token(data, salt="default"):
    return signer.sign(f"{data}:{salt}")


def verify_token(token, salt="default", max_age=3600):
    try:
        value = signer.unsign(token, max_age=max_age)
        return value.split(":")[0]
    except Exception:
        return None


def generate_otp_code(length=6):
    return "".join([str(random.randint(0, 9)) for _ in range(length)])
