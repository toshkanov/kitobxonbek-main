import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function TermsPage({
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

      <h1 className="text-3xl font-bold mb-2">Foydalanish shartlari</h1>
      <p className="text-sm text-muted-foreground mb-8">Oxirgi yangilanish: 2025-yil 1-yanvar</p>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Umumiy qoidalar</h2>
          <p>
            Kitobxon platforma (bundan buyon &quot;Platforma&quot;) xizmatlaridan foydalanish ushbu Foydalanish shartlariga roziligingizni bildiradi.
            Agar siz ushbu shartlarga rozi bo&apos;lmasangiz, platformadan foydalanmang.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Ro&apos;yxatdan o&apos;tish</h2>
          <p>
            Platformadan foydalanish uchun ro&apos;yxatdan o&apos;tish talab etilishi mumkin. Ro&apos;yxatdan o&apos;tayotganda
            to&apos;g&apos;ri ma&apos;lumot kiritishingiz va hisobingiz xavfsizligini ta&apos;minlashingiz shart.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Xarid va to&apos;lov</h2>
          <p>
            Barcha narxlar so&apos;mda ko&apos;rsatilgan. To&apos;lov amalga oshirilgandan so&apos;ng buyurtma tasdiqlangan hisoblanadi.
            Elektron kitoblar va audiokitoblar sotib olinganidan keyin qaytarilmaydi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibill text-foreground mb-2">4. Intellektual mulk</h2>
          <p>
            Platformadagi barcha kontent (kitoblar, rasmlar, matnlar) mualliflik huquqi bilan himoyalangan.
            Ruxsatsiz nusxalash, tarqatish taqiqlanadi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Mas&apos;uliyat cheklovi</h2>
          <p>
            Platforma xizmatlarni &quot;mavjud bo&apos;lganidek&quot; taqdim etadi. Texnik uzilishlar yoki xatolar uchun
            Kitobxon mas&apos;ul emas.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Shartlarni o&apos;zgartirish</h2>
          <p>
            Biz ushbu shartlarni istalgan vaqtda o&apos;zgartirish huquqini saqlab qolamiz.
            O&apos;zgarishlar platformada e&apos;lon qilinadi.
          </p>
        </section>
      </div>
    </div>
  );
}
