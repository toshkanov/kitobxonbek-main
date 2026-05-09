import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const email = sp?.email ?? "sherzodakramov0932@gmail.com";
  return (
    <AuthCard title="Emailingizni tasdiqlang">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl">
          <Mail className="size-8" />
        </div>
        <p className="text-muted-foreground text-sm">
          Tasdiqlash kodi yuborildi: <span className="font-medium text-foreground">{email}</span>
        </p>
        <Button variant="outline" size="lg" className="w-full" render={<Link href="/login" />}>
          Kirishga qaytish
        </Button>
      </div>
    </AuthCard>
  );
}
