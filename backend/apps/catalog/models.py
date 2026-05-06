import uuid
from django.db import models
from django.urls import reverse
from django.utils import timezone

from apps.common.mixins import TimestampMixin
from apps.common.utils.slug import unicode_slugify, generate_unique_slug


class Author(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True, max_length=250)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="authors/", blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    death_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        db_table = "authors"
        ordering = ["full_name"]
        indexes = [models.Index(fields=["slug"])]

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Author, self.full_name)
        super().save(*args, **kwargs)

    def get_book_count(self):
        return self.books.count()


class Publisher(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True, db_index=True)
    slug = models.SlugField(unique=True, max_length=250)
    logo = models.ImageField(upload_to="publishers/", blank=True, null=True)
    website = models.URLField(blank=True)

    class Meta:
        db_table = "publishers"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unicode_slugify(self.name)
            if not self.slug:
                self.slug = f"publisher-{self.pk or 'new'}"
        super().save(*args, **kwargs)


class Genre(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, max_length=150)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon nomi")

    class Meta:
        db_table = "genres"
        ordering = ["name"]
        verbose_name_plural = "Genres"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unicode_slugify(self.name)
        super().save(*args, **kwargs)


class Language(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=5, unique=True)
    name = models.CharField(max_length=50)

    class Meta:
        db_table = "languages"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Book(TimestampMixin):
    COVER_CHOICES = [
        ("hardcover", "Qattiq muqova"),
        ("softcover", "Yumshoq muqova"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300, db_index=True)
    slug = models.SlugField(unique=True, max_length=350)
    isbn = models.CharField(max_length=20, unique=True, db_index=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500)

    authors = models.ManyToManyField(Author, related_name="books")
    publisher = models.ForeignKey(
        Publisher,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="books",
    )
    genres = models.ManyToManyField(Genre, related_name="books")
    language = models.ForeignKey(Language, on_delete=models.PROTECT, related_name="books")

    price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    discount_percentage = models.PositiveSmallIntegerField(null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)

    page_count = models.PositiveIntegerField()
    cover_type = models.CharField(max_length=20, choices=COVER_CHOICES, default="softcover")
    weight_grams = models.PositiveIntegerField(null=True, blank=True)
    dimensions = models.CharField(max_length=50, blank=True)

    has_paperback = models.BooleanField(default=True)
    has_ebook = models.BooleanField(default=False)
    has_audiobook = models.BooleanField(default=False)

    ebook_file = models.FileField(upload_to="ebooks/", null=True, blank=True)
    audiobook_file = models.FileField(upload_to="audiobooks/", null=True, blank=True)
    audiobook_duration = models.DurationField(null=True, blank=True)

    publication_date = models.DateField()
    edition = models.CharField(max_length=50, blank=True)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)

    view_count = models.PositiveIntegerField(default=0)
    sold_count = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.PositiveIntegerField(default=0)

    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)

    class Meta:
        db_table = "books"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_published", "is_featured"]),
            models.Index(fields=["is_published", "is_bestseller"]),
            models.Index(fields=["is_published", "is_new"]),
            models.Index(fields=["price"]),
            models.Index(fields=["average_rating"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Book, self.title)
        if self.discount_price and self.price:
            self.discount_percentage = int(
                ((self.price - self.discount_price) / self.price) * 100
            )
        super().save(*args, **kwargs)

    def increment_views(self):
        Book.objects.filter(pk=self.pk).update(view_count=models.F("view_count") + 1)

    def increment_sold(self, quantity=1):
        Book.objects.filter(pk=self.pk).update(sold_count=models.F("sold_count") + quantity)

    @property
    def effective_price(self):
        if self.discount_price:
            return self.discount_price
        return self.price

    def decrement_stock(self, quantity=1):
        Book.objects.filter(pk=self.pk).update(stock_quantity=models.F("stock_quantity") - quantity)

    @property
    def in_stock(self):
        return self.stock_quantity > 0


class BookImage(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="books/")
    is_primary = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "book_images"
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.book.title}"

    def save(self, *args, **kwargs):
        if self.is_primary:
            BookImage.objects.filter(book=self.book, is_primary=True).exclude(pk=self.pk).update(
                is_primary=False
            )
        super().save(*args, **kwargs)


class BookCollection(TimestampMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="collections/", blank=True, null=True)
    books = models.ManyToManyField(Book, related_name="collections")
    is_featured = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        db_table = "book_collections"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(BookCollection, self.title)
        super().save(*args, **kwargs)
