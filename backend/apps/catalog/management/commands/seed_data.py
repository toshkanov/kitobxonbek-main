"""
Seed script to populate the database with test data.
Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
import uuid

from apps.catalog.models import Author, Genre, Publisher, Language, Book, BookCollection
from apps.accounts.models import User


class Command(BaseCommand):
    help = "Seed database with test data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # Create superuser if not exists
        if not User.objects.filter(email="admin@kitobxon.uz").exists():
            User.objects.create_superuser(
                email="admin@kitobxon.uz",
                password="admin123",
                full_name="Administrator",
            )
            self.stdout.write("Created superuser: admin@kitobxon.uz / admin123")

        # Create genres
        genre_data = [
            {"name": "Badiiy adabiyot", "slug": "badiiy", "icon": "📖"},
            {"name": "Ilmiy adabiyot", "slug": "ilmiy", "icon": "🔬"},
            {"name": "Tarixiy", "slug": "tarixiy", "icon": "🏛️"},
            {"name": "Bolalar uchun", "slug": "bolalar", "icon": "🧸"},
            {"name": "Biznes", "slug": "biznes", "icon": "💼"},
            {"name": "Shaxsiy rivojlanish", "slug": "shaxsiy-rivojlanish", "icon": "🌱"},
            {"name": "She'riyat", "slug": "shoir", "icon": "✒️"},
            {"name": "Diniy", "slug": "diniy", "icon": "☪️"},
        ]

        parent_genres = {}
        for data in genre_data:
            genre, created = Genre.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "icon": data["icon"],
                },
            )
            parent_genres[data["slug"]] = genre
            if created:
                self.stdout.write(f"  Created genre: {genre.name}")

        # Create sub-genres
        sub_genre_data = [
            {"parent": "badiiy", "name": "Roman", "slug": "roman", "icon": "📚"},
            {"parent": "badiiy", "name": "Hikoya", "slug": "hikoya", "icon": "📝"},
            {"parent": "badiiy", "name": "Fantastika", "slug": "fantastika", "icon": "🚀"},
            {"parent": "ilmiy", "name": "Fizika", "slug": "fizika", "icon": "⚛️"},
            {"parent": "ilmiy", "name": "Matematika", "slug": "matematika", "icon": "📐"},
            {"parent": "tarixiy", "name": "O'rta asrlar", "slug": "orta-asrlar", "icon": "⚔️"},
            {"parent": "biznes", "name": "Marketing", "slug": "marketing", "icon": "📊"},
            {"parent": "biznes", "name": "Moliya", "slug": "moliya", "icon": "💰"},
        ]

        for data in sub_genre_data:
            parent = parent_genres.get(data["parent"])
            if parent:
                genre, created = Genre.objects.get_or_create(
                    slug=data["slug"],
                    defaults={
                        "name": data["name"],
                        "icon": data["icon"],
                        "parent": parent,
                    },
                )
                if created:
                    self.stdout.write(f"  Created sub-genre: {genre.name}")

        # Create authors
        author_data = [
            {
                "full_name": "Abdulla Qodiriy",
                "slug": "abdulla-qodiriy",
                "bio": "O'zbek adabiyotining buyuk namoyandasi, roman janrining asoschisi.",
                "nationality": "O'zbek",
                "birth_date": "1894-04-10",
                "death_date": "1938-10-04",
                "is_featured": True,
            },
            {
                "full_name": "Cho'lpon",
                "slug": "cholpon",
                "bio": "O'zbek shoiri, yozuvchi va dramaturg.",
                "nationality": "O'zbek",
                "birth_date": "1893-01-01",
                "death_date": "1938-10-04",
                "is_featured": True,
            },
            {
                "full_name": "O'tkir Hoshimov",
                "slug": "otkir-hoshimov",
                "bio": "O'zbek yozuvchisi, O'zbekiston xalq yozuvchisi.",
                "nationality": "O'zbek",
                "birth_date": "1941-06-01",
                "death_date": "2000-12-15",
                "is_featured": True,
            },
            {
                "full_name": "Pyotr L. Kapitsa",
                "slug": "pyotr-kapitsa",
                "bio": "Soviet fizigi, Nobel mukofoti sovrindori.",
                "nationality": "Rus",
                "birth_date": "1894-07-08",
                "death_date": "1984-04-08",
                "is_featured": False,
            },
            {
                "full_name": "Robert Kiyosaki",
                "slug": "robert-kiyosaki",
                "bio": "Amerikalik tadbirkor va yozuvchi.",
                "nationality": "Amerikalik",
                "birth_date": "1947-04-08",
                "is_featured": True,
            },
        ]

        authors = {}
        for data in author_data:
            author, created = Author.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "full_name": data["full_name"],
                    "bio": data["bio"],
                    "nationality": data["nationality"],
                    "is_featured": data["is_featured"],
                    "birth_date": data.get("birth_date"),
                    "death_date": data.get("death_date"),
                },
            )
            authors[data["slug"]] = author
            if created:
                self.stdout.write(f"  Created author: {author.full_name}")

        # Create publishers
        publishers = {}
        pub_data = [
            {"name": "Sharq", "slug": "sharq"},
            {"name": "O'zbekiston", "slug": "ozbekiston"},
            {"name": "G'afur G'ulom", "slug": "gafur-gulom"},
        ]

        for data in pub_data:
            pub, created = Publisher.objects.get_or_create(
                slug=data["slug"],
                defaults={"name": data["name"]},
            )
            publishers[data["slug"]] = pub
            if created:
                self.stdout.write(f"  Created publisher: {pub.name}")

        # Create languages
        uz_lang, _ = Language.objects.get_or_create(code="uz", defaults={"name": "O'zbekcha"})
        ru_lang, _ = Language.objects.get_or_create(code="ru", defaults={"name": "Русский"})
        en_lang, _ = Language.objects.get_or_create(code="en", defaults={"name": "English"})

        # Create books
        book_data = [
            {
                "title": "O'tgan kunlar",
                "slug": "otgan-kunlar",
                "isbn": "978-9943-01-001-1",
                "description": "Abdulla Qodiriyning eng mashhur romani. XIX asr oxiri va XX asr boshlaridagi Toshkent hayoti tasvirlangan.",
                "short_description": "XIX asr Toshkent hayoti haqida roman",
                "authors": ["abdulla-qodiriy"],
                "publisher": "sharq",
                "genres": ["badiiy", "roman"],
                "language": "uz",
                "price": 45000,
                "discount_price": 38000,
                "stock_quantity": 150,
                "page_count": 480,
                "cover_type": "hardcover",
                "publication_date": "2020-03-15",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "has_ebook": True,
                "has_audiobook": True,
            },
            {
                "title": "Mehrobdan chayon",
                "slug": "mehrobdan-chayon",
                "isbn": "978-9943-01-002-8",
                "description": "Abdulla Qodiriyning ikkinchi mashhur romani. Buxoro amirligi davridagi voqealar tasvirlangan.",
                "short_description": "Buxoro amirligi haqida tarixiy roman",
                "authors": ["abdulla-qodiriy"],
                "publisher": "gafur-gulom",
                "genres": ["badiiy", "roman", "tarixiy"],
                "language": "uz",
                "price": 52000,
                "discount_price": None,
                "stock_quantity": 85,
                "page_count": 520,
                "cover_type": "hardcover",
                "publication_date": "2019-06-20",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "has_ebook": True,
                "has_audiobook": False,
            },
            {
                "title": "Tonggi shovqin",
                "slug": "tonggi-shovqin",
                "isbn": "978-9943-01-003-5",
                "description": "Cho'lponning she'riy asarlari to'plami. Vatan, sevgi va ozodlik haqida she'rlar.",
                "short_description": "Cho'lpon she'rlari to'plami",
                "authors": ["cholpon"],
                "publisher": "sharq",
                "genres": ["shoir"],
                "language": "uz",
                "price": 28000,
                "discount_price": 22000,
                "stock_quantity": 200,
                "page_count": 240,
                "cover_type": "softcover",
                "publication_date": "2021-09-01",
                "is_featured": True,
                "is_bestseller": False,
                "is_new": False,
                "has_ebook": True,
                "has_audiobook": False,
            },
            {
                "title": "Ikki eshik orasi",
                "slug": "ikki-eshik-orasi",
                "isbn": "978-9943-01-004-2",
                "description": "O'tkir Hoshimovning eng mashhur romani. Qishloq hayoti va insoniy munosabatlar haqida.",
                "short_description": "Qishloq hayoti haqida roman",
                "authors": ["otkir-hoshimov"],
                "publisher": "ozbekiston",
                "genres": ["badiiy", "roman"],
                "language": "uz",
                "price": 35000,
                "discount_price": 30000,
                "stock_quantity": 120,
                "page_count": 360,
                "cover_type": "softcover",
                "publication_date": "2022-01-15",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": False,
                "has_ebook": True,
                "has_audiobook": True,
            },
            {
                "title": "Boy ila xizmatchi",
                "slug": "boy-ila-xizmatchi",
                "isbn": "978-9943-01-005-9",
                "description": "O'tkir Hoshimovning komedik romani. Boy va xizmatchi o'rtasidagi munosabatlar hazil-mutoyiba bilan tasvirlangan.",
                "short_description": "Komediya romani",
                "authors": ["otkir-hoshimov"],
                "publisher": "gafur-gulom",
                "genres": ["badiiy", "hikoya"],
                "language": "uz",
                "price": 32000,
                "discount_price": None,
                "stock_quantity": 95,
                "page_count": 280,
                "cover_type": "softcover",
                "publication_date": "2023-05-10",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
                "has_ebook": True,
                "has_audiobook": False,
            },
            {
                "title": "Rich Dad Poor Dad",
                "slug": "rich-dad-poor-dad",
                "isbn": "978-9943-01-006-6",
                "description": "Robert Kiyosakining moliyaviy savodxonlik haqidagi mashhur kitobi. O'zbek tiliga tarjima qilingan.",
                "short_description": "Moliyaviy savodxonlik haqida kitob",
                "authors": ["robert-kiyosaki"],
                "publisher": "sharq",
                "genres": ["biznes", "moliya", "shaxsiy-rivojlanish"],
                "language": "uz",
                "price": 55000,
                "discount_price": 48000,
                "stock_quantity": 180,
                "page_count": 320,
                "cover_type": "hardcover",
                "publication_date": "2023-11-01",
                "is_featured": True,
                "is_bestseller": True,
                "is_new": True,
                "has_ebook": True,
                "has_audiobook": True,
            },
            {
                "title": "Fizika asoslari",
                "slug": "fizika-asoslari",
                "isbn": "978-9943-01-007-3",
                "description": "Fizika fanining asosiy tamoyillari haqida darslik. Talabalar va o'qituvchilar uchun.",
                "short_description": "Fizika darsligi",
                "authors": ["pyotr-kapitsa"],
                "publisher": "ozbekiston",
                "genres": ["ilmiy", "fizika"],
                "language": "uz",
                "price": 65000,
                "discount_price": None,
                "stock_quantity": 50,
                "page_count": 640,
                "cover_type": "hardcover",
                "publication_date": "2024-02-15",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
                "has_ebook": True,
                "has_audiobook": False,
            },
            {
                "title": "Kelajak sari",
                "slug": "kelajak-sari",
                "isbn": "978-9943-01-008-0",
                "description": "Fantastik roman. Insoniyatning kelajagi va texnologik taraqqiyot haqida.",
                "short_description": "Fantastik roman",
                "authors": ["otkir-hoshimov"],
                "publisher": "sharq",
                "genres": ["badiiy", "fantastika"],
                "language": "uz",
                "price": 42000,
                "discount_price": 35000,
                "stock_quantity": 110,
                "page_count": 380,
                "cover_type": "softcover",
                "publication_date": "2024-08-20",
                "is_featured": True,
                "is_bestseller": False,
                "is_new": True,
                "has_ebook": True,
                "has_audiobook": True,
            },
            {
                "title": "Bolalar dunyosi",
                "slug": "bolalar-dunyosi",
                "isbn": "978-9943-01-009-7",
                "description": "Bolalar uchun hikoyalar to'plami. Tarbiyaviy va qiziqarli hikoyalar.",
                "short_description": "Bolalar hikoyalari",
                "authors": ["cholpon"],
                "publisher": "gafur-gulom",
                "genres": ["bolalar"],
                "language": "uz",
                "price": 18000,
                "discount_price": 15000,
                "stock_quantity": 250,
                "page_count": 160,
                "cover_type": "softcover",
                "publication_date": "2024-06-01",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
                "has_ebook": False,
                "has_audiobook": True,
            },
            {
                "title": "Din va jamiyat",
                "slug": "din-va-jamiyat",
                "isbn": "978-9943-01-010-3",
                "description": "Din va jamiyat o'rtasidagi munosabatlar haqida ilmiy tadqiqot.",
                "short_description": "Din va jamiyat haqida kitob",
                "authors": ["pyotr-kapitsa"],
                "publisher": "ozbekiston",
                "genres": ["diniy"],
                "language": "uz",
                "price": 48000,
                "discount_price": None,
                "stock_quantity": 70,
                "page_count": 420,
                "cover_type": "hardcover",
                "publication_date": "2025-01-10",
                "is_featured": False,
                "is_bestseller": False,
                "is_new": True,
                "has_ebook": True,
                "has_audiobook": False,
            },
        ]

        for data in book_data:
            book, created = Book.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "isbn": data["isbn"],
                    "description": data["description"],
                    "short_description": data["short_description"],
                    "price": data["price"],
                    "discount_price": data["discount_price"],
                    "stock_quantity": data["stock_quantity"],
                    "page_count": data["page_count"],
                    "cover_type": data["cover_type"],
                    "publication_date": data["publication_date"],
                    "is_featured": data["is_featured"],
                    "is_bestseller": data["is_bestseller"],
                    "is_new": data["is_new"],
                    "has_paperback": True,
                    "has_ebook": data["has_ebook"],
                    "has_audiobook": data["has_audiobook"],
                    "publisher": publishers[data["publisher"]],
                    "language": Language.objects.get(code=data["language"]),
                },
            )
            if created:
                # Add authors
                for author_slug in data["authors"]:
                    book.authors.add(authors[author_slug])

                # Add genres
                for genre_slug in data["genres"]:
                    genre = Genre.objects.filter(slug=genre_slug).first()
                    if genre:
                        book.genres.add(genre)

                self.stdout.write(f"  Created book: {book.title}")

        # Create collections
        collection_data = [
            {
                "title": "Eng ko'p o'qilganlar",
                "slug": "eng-kop-oqilganlar",
                "description": "Eng mashhur va ko'p o'qilgan kitoblar to'plami",
                "books_slugs": ["otgan-kunlar", "mehrobdan-chayon", "ikki-eshik-orasi", "rich-dad-poor-dad"],
                "is_featured": True,
                "order": 1,
            },
            {
                "title": "Yangi kelganlar",
                "slug": "yangi-kelganlar",
                "description": "Eng yangi nashr qilingan kitoblar",
                "books_slugs": ["boy-ila-xizmatchi", "fizika-asoslari", "kelajak-sari", "bolalar-dunyosi", "din-va-jamiyat"],
                "is_featured": True,
                "order": 2,
            },
            {
                "title": "O'zbek klassikalari",
                "slug": "ozbek-klassikalari",
                "description": "O'zbek adabiyotining klassik asarlari",
                "books_slugs": ["otgan-kunlar", "mehrobdan-chayon", "tonggi-shovqin"],
                "is_featured": True,
                "order": 3,
            },
        ]

        for data in collection_data:
            collection, created = BookCollection.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "description": data["description"],
                    "is_featured": data["is_featured"],
                    "order": data["order"],
                },
            )
            if created:
                for book_slug in data["books_slugs"]:
                    book = Book.objects.filter(slug=book_slug).first()
                    if book:
                        collection.books.add(book)
                self.stdout.write(f"  Created collection: {collection.title}")
            else:
                # Update books
                collection.books.clear()
                for book_slug in data["books_slugs"]:
                    book = Book.objects.filter(slug=book_slug).first()
                    if book:
                        collection.books.add(book)
                self.stdout.write(f"  Updated collection: {collection.title}")

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))
