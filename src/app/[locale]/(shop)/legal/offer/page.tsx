import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function PublicOfferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Bosh sahifa
      </Link>

      <h1 className="text-3xl font-bold mb-2">Ommaviy oferta</h1>
      <p className="text-sm text-muted-foreground mb-8">Oxirgi yangilanish: 2025-yil 1-yanvar</p>

      <div className="space-y-6 text-muted-foreground text-sm">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Tariflar</h2>
          <p>
            Kitobxon &quot;Kitobxon MMJ&quot; (STIR: 123456789) nomidan taqdim etiladi.
            Kompaniya O&apos;zbekiston Respublikasi qonunchiligiga muvofiq ro&apos;yxatdan o&apos;tgan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Shartnoma predmeti</h2>
          <p>
            Ushbu oferta asosida Kitobxon foydalanuvchiga kitoblar va raqamli kontentni sotib olish,
            obuna xizmatlaridan foydalanish imkoniyatini taqdim etadi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Narxlar va to&apos;lov</h2>
          <p>
            Barcha narxlar O&apos;zbekiston so&apos;mida ko&apos;rsatiladi. QQS qonun talablariga muvofiq qo&apos;shiladi.
            To&apos;lov amalga oshirilgandan so&apos;ng shartnoma tuzilgan hisoblanadi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Yetkazib berish shartlari</h2>
          <p>
            Kitoblar buyurtma qabul qilinganidan so&apos;ng 1-7 ish kuni ichida yetkazib beriladi.
            Elektron kitoblar va audiokitoblar to&apos;lovdan so&apos;ng darhol yuklab olish uchun taqdim etiladi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Qaytarish va bekor qilish</h2>
          <p>
            Jismoniy kitoblar yetkazib berilganidan 14 kun ichida qaytarilishi mumkin.
            Raqamli mahsulotlar (elektron kitoblar, audiokitoblar) qaytarilmaydi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Nizolarni hal etish</h2>
          <p>
            Nizolar muzokaralar yo&apos;li bilan hal etilishga harakat qilinadi.
            Muzokaralar natija bermasa, O&apos;zbekiston Respublikasi qonunchiligiga muvofiq sud tartibida hal etiladi.
          </p>
        </section>
      </div>
    </div>
  );
}
