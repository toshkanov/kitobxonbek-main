import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Phone, Mail, MessageSquare, MapPin } from "lucide-react";

export default async function ContactPage({
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

      <h1 className="text-3xl font-bold mb-8">Bog&apos;lanish</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold">Telefon</h2>
          </div>
          <p className="text-sm text-muted-foreground">+998 71 000 00 00</p>
          <p className="text-xs text-muted-foreground mt-1">Dushanba–Shanba, 9:00–18:00</p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold">Email</h2>
          </div>
          <p className="text-sm text-muted-foreground">info@kitobxon.uz</p>
          <p className="text-xs text-muted-foreground mt-1">24 soat ichida javob beramiz</p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold">Telegram</h2>
          </div>
          <p className="text-sm text-muted-foreground">@kitobxon_support</p>
          <p className="text-xs text-muted-foreground mt-1">Tez javob uchun Telegram</p>
        </div>

        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="size-5 text-primary" />
            </div>
            <h2 className="font-semibold">Manzil</h2>
          </div>
          <p className="text-sm text-muted-foreground">Toshkent shahri, Yunusobod tumani</p>
          <p className="text-xs text-muted-foreground mt-1">Dushanba–Shanba, 9:00–18:00</p>
        </div>
      </div>
    </div>
  );
}
