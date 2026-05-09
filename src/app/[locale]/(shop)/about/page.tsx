import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Truck, Shield, Headphones } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const features = [
    { icon: BookOpen, title: "Keng tanlov", desc: "Minglab kitoblar, mualliflar va janrlar" },
    { icon: Truck, title: "Tezkor yetkazish", desc: "O'zbekiston bo'ylab yetkazib berish" },
    { icon: Shield, title: "Xavfsiz to'lov", desc: "Click, Payme, karta orqali to'lov" },
    { icon: Headphones, title: "Audio kitoblar", desc: "Yo'lda, sportzalda tinglang" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">
          Kitobxon — bu zamonaviy onlayn kitob do&apos;koni. Bizning maqsadimiz — kitob o&apos;qishni yanada qulay va qiziqarli qilish.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center p-6 rounded-lg border">
            <f.icon className="size-10 mb-4 text-primary" />
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/books">
          <Button size="lg">Kitoblarni ko&apos;rish</Button>
        </Link>
      </div>
    </div>
  );
}
