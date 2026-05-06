"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations/auth";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordInput) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Tiklash havolasi emailingizga yuborildi");
      console.log("Forgot password:", values);
    });
  };

  return (
    <AuthCard
      title="Parolni tiklash"
      subtitle="Email manzilingizni kiriting va biz sizga tiklash havolasini yuboramiz"
      footer={
        <Link href="/login" className="text-foreground font-semibold hover:underline">
          Kirishga qaytish
        </Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? "..." : "Tiklash havolasini yuborish"}
        </Button>
      </form>
    </AuthCard>
  );
}
