import re

from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible


UZBEK_PHONE_REGEX = re.compile(r"^(\+998|998)?(9[0-49]|88|77|78|9[57]|91|93|95|97|98|99)\d{7}$")


@deconstructible
class UzbekPhoneValidator:
    message = "Noto'g'ri o'zbek telefon raqami. Masalan: +998901234567"
    code = "invalid_phone"

    def __init__(self, message=None, code=None):
        if message is not None:
            self.message = message
        if code is not None:
            self.code = code

    def __call__(self, value):
        if not UZBEK_PHONE_REGEX.match(value.strip().replace("-", "").replace(" ", "")):
            raise ValidationError(self.message, code=self.code)

    def __eq__(self, other):
        return (
            isinstance(other, self.__class__)
            and self.message == other.message
            and self.code == other.code
        )


ISBN_REGEX = re.compile(r"^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$")


@deconstructible
class ISBNValidator:
    message = "Noto'g'ri ISBN formati"
    code = "invalid_isbn"

    def __init__(self, message=None, code=None):
        if message is not None:
            self.message = message
        if code is not None:
            self.code = code

    def __call__(self, value):
        cleaned = value.replace("-", "").replace(" ", "")
        if len(cleaned) not in (10, 13) or not ISBN_REGEX.match(value):
            raise ValidationError(self.message, code=self.code)

    def __eq__(self, other):
        return (
            isinstance(other, self.__class__)
            and self.message == other.message
            and self.code == other.code
        )


uzbek_phone_validator = UzbekPhoneValidator()
isbn_validator = ISBNValidator()
