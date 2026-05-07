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
      className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12"
    >
      {/* Animated ambient orbs */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" />
        <div className="absolute -top-40 -right-32 h-[480px] w-[480px] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-amber-300/40 via-rose-300/30 to-purple-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-gradient-to-tr from-sky-300/40 via-emerald-300/30 to-teal-400/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-fuchsia-300/20 to-cyan-300/20 blur-3xl" />
      </div>

      <Link
        href="/"
        className="group mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-90"
      >
        <span className="from-primary to-primary/70 text-primary-foreground grid size-10 place-items-center rounded-xl bg-gradient-to-br shadow-lg shadow-black/10 transition-transform group-hover:scale-105">
          <BookOpen className="size-5" />
        </span>
        <span className="text-xl font-bold tracking-tight">Kitobxon</span>
      </Link>

      <div className="w-full max-w-md">{children}</div>

      <p className="text-muted-foreground mt-8 text-xs">
        &copy; {new Date().getFullYear()} Kitobxon. Barcha huquqlar himoyalangan.
      </p>
    </main>
  );
}
