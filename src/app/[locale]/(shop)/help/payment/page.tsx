import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Shield } from "lucide-react";

export default async function PaymentPage({
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

      <h1 className="text-3xl font-bold mb-8">To&apos;lov</h1>

      <div className="space-y-6">
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Click va Payme</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Click yoki Payme ilovasidan foydalanib, buyurtmani tez va qulay to&apos;lashingiz mumkin.
            To&apos;lov darhol tasdiqlandi hisoblanadi.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Bank kartasi</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Visa, MasterCard yoki O&apos;zbekiston milliy to&apos;lov kartalari qabul qilinadi.
            Ma&apos;lumotlaringiz xavfsizligini kafolatlaymiz.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Banknote className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Naqd pul</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Kuryer yetkazib kelganida yoki ofisimizdan olib ketishda naqd pul bilan to&apos;lash mumkin.
          </p>
        </div>

        <div className="border rounded-xl p-6 bg-primary/5">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="size-5 text-primary" />
            <h2 className="font-semibold">Xavfsiz to&apos;lov</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Barcha to&apos;lovlar SSL shifrlash orqali himoyalangan. Karta ma&apos;lumotlaringiz bizning serverlarimizda saqlanmaydi.
          </p>
        </div>
      </div>
    </div>
  );
}
