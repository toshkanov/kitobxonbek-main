import unicodedata
import random
import string

from django.utils.text import slugify as django_slugify


def unicode_slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return django_slugify(text)


def generate_unique_slug(model, title, slug_field="slug", max_retries=100):
    base_slug = unicode_slugify(title)
    slug = base_slug

    for _ in range(max_retries):
        if not model.objects.filter(**{slug_field: slug}).exists():
            return slug
        random_suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
        slug = f"{base_slug}-{random_suffix}"

    raise ValueError(f"Unable to generate unique slug for '{title}'")


def generate_referral_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=length))


def generate_order_number():
    from django.utils import timezone
    import random

    now = timezone.now()
    year = now.year
    sequence = random.randint(1, 99999)
    return f"KTB-{year}-{sequence:05d}"
