import type { Author, Book, Genre } from "@/types";

const COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600",
  "https://images.unsplash.com/photo-1485322551133-3a4c27a9d925?w=600",
  "https://images.unsplash.com/photo-1531901599143-ef2fb1aa3e51?w=600",
  "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600",
  "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600",
  "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=600",
];

export const MOCK_AUTHORS: Author[] = [
  { id: "a1", slug: "abdulla-qodiriy", name: "Abdulla Qodiriy", bookCount: 12, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" },
  { id: "a2", slug: "cholpon", name: "Cho'lpon", bookCount: 8, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" },
  { id: "a3", slug: "oybek", name: "Oybek", bookCount: 15, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" },
  { id: "a4", slug: "erkin-vohidov", name: "Erkin Vohidov", bookCount: 22, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" },
  { id: "a5", slug: "abdulla-oripov", name: "Abdulla Oripov", bookCount: 18, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" },
  { id: "a6", slug: "togay-murod", name: "Tog'ay Murod", bookCount: 9, photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300" },
];

export const MOCK_GENRES: Genre[] = [
  { id: "g1", slug: "badiiy", name: "Badiiy", icon: "📖", bookCount: 1240 },
  { id: "g2", slug: "ilmiy", name: "Ilmiy", icon: "🔬", bookCount: 580 },
  { id: "g3", slug: "tarixiy", name: "Tarixiy", icon: "🏛️", bookCount: 420 },
  { id: "g4", slug: "bolalar", name: "Bolalar", icon: "🧸", bookCount: 760 },
  { id: "g5", slug: "biznes", name: "Biznes", icon: "💼", bookCount: 340 },
  { id: "g6", slug: "shaxsiy-rivojlanish", name: "Shaxsiy rivojlanish", icon: "🌱", bookCount: 290 },
  { id: "g7", slug: "shoir-asarlari", name: "She'riyat", icon: "✒️", bookCount: 510 },
  { id: "g8", slug: "diniy", name: "Diniy", icon: "☪️", bookCount: 380 },
];

const TITLES_UZ = [
  "O'tkan kunlar", "Mehrobdan chayon", "Kecha va kunduz", "Sarob",
  "Boburnoma", "Qiyomat", "Yulduzli tunlar", "Ulug'bek xazinasi",
  "Ikki eshik orasi", "Tirilgan murda", "Hayot va ajal", "Olisdagi yulduz",
];

function makeBook(i: number): Book {
  const formats: Book["formats"] = [
    { format: "paperback", price: 65000 + i * 1500, oldPrice: 80000 + i * 1500, stock: 12 - (i % 5), isAvailable: true },
    { format: "ebook", price: 25000 + i * 800, stock: 999, isAvailable: true },
  ];
  if (i % 3 === 0) {
    formats.push({ format: "audio", price: 35000 + i * 800, stock: 999, isAvailable: true });
  }
  return {
    id: `b${i + 1}`,
    slug: `kitob-${i + 1}`,
    title: TITLES_UZ[i % TITLES_UZ.length],
    shortDescription: "O'zbek adabiyotining nodir asarlaridan biri. Hayot, sevgi va o'zlikni topish haqida.",
    description: "Bu kitob o'quvchini tarixning oltin sahifalariga olib kiradi va inson taqdiri haqida chuqur fikr yuritishga undaydi.",
    coverImage: COVERS[i % COVERS.length],
    authors: [MOCK_AUTHORS[i % MOCK_AUTHORS.length]],
    genres: [MOCK_GENRES[i % MOCK_GENRES.length]],
    language: "uz",
    pageCount: 280 + i * 12,
    publisher: "Sharq nashriyoti",
    rating: 4.2 + (i % 7) * 0.1,
    reviewCount: 23 + i * 7,
    formats,
    defaultFormat: "paperback",
  };
}

export const MOCK_BOOKS: Book[] = Array.from({ length: 24 }, (_, i) => makeBook(i));

export const MOCK_BESTSELLERS = MOCK_BOOKS.slice(0, 12);
export const MOCK_NEW_ARRIVALS = MOCK_BOOKS.slice(6, 18);
export const MOCK_AUDIO_BOOKS = MOCK_BOOKS.filter((b) =>
  b.formats.some((f) => f.format === "audio"),
).slice(0, 8);

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  bookCount: number;
}

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "c1",
    slug: "uzbek-klassikasi",
    title: "O'zbek klassikasi",
    description: "Milliy adabiyotimizning eng sara namunalari",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    bookCount: 48,
  },
  {
    id: "c2",
    slug: "biznes-kitoblari",
    title: "Biznes va liderlik",
    description: "Muvaffaqiyatga eltuvchi g'oyalar",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    bookCount: 36,
  },
  {
    id: "c3",
    slug: "bolalar-kutubxonasi",
    title: "Bolalar kutubxonasi",
    description: "Yosh kitobxonlar uchun maxsus to'plam",
    cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    bookCount: 124,
  },
  {
    id: "c4",
    slug: "shaxsiy-rivojlanish",
    title: "O'zlikni topish",
    description: "Shaxsiy rivojlanish va psixologiya",
    cover: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    bookCount: 62,
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Madina Karimova",
    role: "O'qituvchi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    text: "Kitoblarning katta tanlovi va tezkor yetkazib berish — Kitobxonni har kuni tavsiya qilaman.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Akmal Rahimov",
    role: "Talaba",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    text: "Audio kitoblar yo'lda tinglash uchun juda qulay. Narxlari ham ajoyib.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Nigora Yusupova",
    role: "Dizayner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    text: "Sayt dizayni juda chiroyli va ishlatish oson. Sevimli kitoblarimni topdim!",
    rating: 4,
  },
];
