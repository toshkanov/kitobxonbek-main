import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

export default async function ReturnsPage({
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

      <h1 className="text-3xl font-bold mb-8">Qaytarish siyosati</h1>

      <div className="space-y-6">
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Qaytarish muddati</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Kitobni olganingizdan boshlab <strong>14 kun</strong> ichida qaytarish mumkin.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Qaytarish mumkin</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Kitob zavoddan chiqib kelgandagi holatda bo&apos;lsa</li>
            <li>Yopishtirilgan muqovasi ochilmagan bo&apos;lsa</li>
            <li>Noto&apos;g&apos;ri kitob yetkazilgan bo&apos;lsa</li>
            <li>Kitobda bosma xatosi bo&apos;lsa</li>
          </ul>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="size-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Qaytarish mumkin emas</h2>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Ishlatilgan yoki shikastlangan kitoblar</li>
            <li>Elektron kitoblar va audiokitoblar (yuklab olinganidan keyin)</li>
            <li>14 kundan o&apos;tgandan keyin</li>
          </ul>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RotateCcw className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Qaytarish tartibi</h2>
          </div>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>+998 71 000 00 00 raqamiga qo&apos;ng&apos;iroq qiling</li>
            <li>Buyurtma raqamingizni ayting</li>
            <li>Kitobni yetkazib berish manzilimizga qaytaring</li>
            <li>Pul 3-5 ish kuni ichida kartangizga qaytariladi</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
