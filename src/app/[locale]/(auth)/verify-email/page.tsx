import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";

export default function VerifyEmailPage() {
  return (
    <AuthCard title="Emailingizni tasdiqlang">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-primary/10 text-primary grid size-16 place-items-center rounded-2xl">
          <Mail className="size-8" />
        </div>
        <p className="text-muted-foreground text-sm">
          Sizning email manzilingizga tasdiqlash havolasi yuborildi. Iltimos, pochtangizni tekshiring va havolaga bosing.
        </p>
        <Button variant="outline" size="lg" className="w-full" render={<Link href="/login" />}>
          Kirishga qaytish
        </Button>
      </div>
    </AuthCard>
  );
}
