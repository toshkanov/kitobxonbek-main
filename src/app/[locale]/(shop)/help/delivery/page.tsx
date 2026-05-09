import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Truck, Clock, MapPin, Phone } from "lucide-react";

export default async function DeliveryPage({
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

      <h1 className="text-3xl font-bold mb-8">Yetkazib berish</h1>

      <div className="space-y-8">
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Truck className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Yetkazib berish usullari</h2>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Kuryer orqali</p>
              <p>Toshkent shahar bo&apos;yicha 1-2 ish kuni ichida yetkazib beriladi. Narxi: 15,000 so&apos;m.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Pochta orqali</p>
              <p>Respublika bo&apos;yicha 3-7 ish kuni ichida yetkazib beriladi. Narxi: 20,000-30,000 so&apos;m.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">O&apos;zi olib ketish</p>
              <p>Buyurtma tayyor bo&apos;lgandan so&apos;ng ofisimizdan bepul olib ketishingiz mumkin.</p>
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Ish vaqti</h2>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Dushanba – Shanba: 9:00 – 18:00</p>
            <p>Yakshanba: Dam olish kuni</p>
            <p>Buyurtmalar har kuni kechki 17:00 gacha qabul qilinadi.</p>
          </div>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Manzilimiz</h2>
          </div>
          <p className="text-sm text-muted-foreground">Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko&apos;chasi</p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Bog&apos;lanish</h2>
          </div>
          <p className="text-sm text-muted-foreground">Savollaringiz bo&apos;lsa: +998 71 000 00 00</p>
        </div>
      </div>
    </div>
  );
}
