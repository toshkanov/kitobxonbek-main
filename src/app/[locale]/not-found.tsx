import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-foreground text-sm tracking-widest uppercase">404</p>
      <h1 className="text-3xl font-semibold sm:text-4xl">Sahifa topilmadi</h1>
      <p className="text-muted-foreground max-w-md">
        Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
      </p>
      <Button size="lg" className="mt-2" render={<Link href="/" />}>
        Bosh sahifaga qaytish
      </Button>
    </main>
  );
}
