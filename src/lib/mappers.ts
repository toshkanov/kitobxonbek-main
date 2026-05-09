import type { BackendBook, BackendBookList, BackendAuthor, BackendGenre } from "@/lib/api/books";
import type { Book, Author, Genre, BookFormatOption, BookFormat } from "@/types";

export function mapBackendAuthor(author: BackendAuthor): Author {
  return {
    id: author.id,
    slug: author.slug,
    name: author.full_name,
    bio: author.bio || undefined,
    photo: author.photo || undefined,
    bookCount: author.book_count,
  };
}

export function mapBackendGenre(genre: BackendGenre): Genre {
  return {
    id: genre.id,
    slug: genre.slug,
    name: genre.name,
    icon: genre.icon || undefined,
  };
}

export function mapBackendBook(book: BackendBook): Book {
  const formats: BookFormatOption[] = [];

  if (book.has_paperback) {
    formats.push({
      format: "paperback",
      price: parseFloat(book.effective_price),
      oldPrice: book.discount_price ? parseFloat(book.discount_price) : undefined,
      stock: book.stock_quantity,
      isAvailable: book.in_stock,
    });
  }

  if (book.has_ebook) {
    const ebookPrice = parseFloat(book.price) * 0.4;
    formats.push({
      format: "ebook",
      price: ebookPrice,
      stock: 999,
      isAvailable: true,
    });
  }

  if (book.has_audiobook) {
    const audioPrice = parseFloat(book.price) * 0.6;
    formats.push({
      format: "audio",
      price: audioPrice,
      stock: 999,
      isAvailable: true,
    });
  }

  if (formats.length === 0) {
    formats.push({
      format: "paperback",
      price: parseFloat(book.effective_price),
      stock: book.stock_quantity,
      isAvailable: book.in_stock,
    });
  }

  const coverImage =
    book.images.find((img) => img.is_primary)?.image ||
    book.images[0]?.image ||
    "";

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    shortDescription: book.short_description,
    description: book.description,
    coverImage,
    images: book.images.map((img) => img.image),
    authors: book.authors.map(mapBackendAuthor),
    genres: book.genres.map(mapBackendGenre),
    language: book.language.code,
    isbn: book.isbn,
    pageCount: book.page_count,
    publishedAt: book.publication_date,
    publisher: book.publisher?.name,
    rating: parseFloat(book.average_rating),
    reviewCount: book.review_count,
    formats,
    defaultFormat: book.has_paperback ? "paperback" : formats[0]?.format || "paperback",
  };
}

export function mapBackendBookList(book: BackendBookList): Book {
  const formats: BookFormatOption[] = [];
  const price = parseFloat(book.effective_price);

  formats.push({
    format: "paperback",
    price,
    stock: book.stock_quantity,
    isAvailable: book.in_stock,
  });

  if (book.has_ebook) {
    formats.push({ format: "ebook", price: price * 0.4, stock: 999, isAvailable: true });
  }
  if (book.has_audiobook) {
    formats.push({ format: "audio", price: price * 0.6, stock: 999, isAvailable: true });
  }

  const coverImage = book.primary_image?.image || "";

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    shortDescription: book.short_description,
    description: "",
    coverImage,
    images: coverImage ? [coverImage] : [],
    authors: book.authors.map(mapBackendAuthor),
    genres: [],
    language: "uz",
    isbn: "",
    pageCount: undefined,
    publishedAt: book.created_at,
    publisher: undefined,
    rating: parseFloat(book.average_rating),
    reviewCount: book.review_count,
    formats,
    defaultFormat: "paperback",
  };
}
