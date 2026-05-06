import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-amber-300/40 via-rose-300/30 to-purple-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-300/40 via-emerald-300/30 to-teal-400/30 blur-3xl" />
      </div>

      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-xl">
          <BookOpen className="size-5" />
        </span>
        <span className="text-xl font-bold tracking-tight">Kitobxon</span>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
