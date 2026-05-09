import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default async function PrivacyPage({
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

      <h1 className="text-3xl font-bold mb-2">Maxfiylik siyosati</h1>
      <p className="text-sm text-muted-foreground mb-8">Oxirgi yangilanish: 2025-yil 1-yanvar</p>

      <div className="space-y-6 text-muted-foreground text-sm">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Qanday ma&apos;lumot yig&apos;amiz</h2>
          <p>
            Ro&apos;yxatdan o&apos;tishda: ism, email, telefon raqam. Xarid qilishda: to&apos;lov ma&apos;lumotlari va yetkazib berish manzili.
            Platformadan foydalanishda: brauzer turi, IP-manzil, ko&apos;rilgan sahifalar.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Ma&apos;lumotlardan foydalanish</h2>
          <p>
            Yig&apos;ilgan ma&apos;lumotlar quyidagi maqsadlarda ishlatiladi:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Buyurtmalarni qayta ishlash va yetkazib berish</li>
            <li>Hisob xavfsizligini ta&apos;minlash</li>
            <li>Xizmat sifatini yaxshilash</li>
            <li>Ruxsat berilgan holda marketing xabarnomalar yuborish</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Ma&apos;lumotlar xavfsizligi</h2>
          <p>
            Barcha ma&apos;lumotlar shifrlangan holda saqlanadi. To&apos;lov ma&apos;lumotlari uchinchi tomon to&apos;lov
            tizimlarida saqlanadi va biz ularga kirish imkoniga ega emasmiz.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Uchinchi tomon bilan ulashish</h2>
          <p>
            Sizning shaxsiy ma&apos;lumotlaringiz uchinchi tomonlarga sotilmaydi. Faqat yetkazib berish xizmati
            uchun zarur bo&apos;lgan ma&apos;lumotlar kuryer kompaniyalariga berilishi mumkin.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Sizning huquqlaringiz</h2>
          <p>
            Ma&apos;lumotlaringizni ko&apos;rish, o&apos;zgartirish yoki o&apos;chirish uchun info@kitobxon.uz manziliga
            murojaat qiling.
          </p>
        </section>
      </div>
    </div>
  );
}
