"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validations/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordInput) => {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Parol o'zgartirildi");
      console.log("Reset password:", values);
      router.push("/login");
    });
  };

  return (
    <AuthCard
      title="Yangi parol"
      subtitle="Yangi parolingizni kiriting"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="password">Yangi parol</Label>
          <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Tasdiqlash</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword && (
            <p className="text-destructive text-xs">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? "..." : "Parolni o'zgartirish"}
        </Button>
      </form>
    </AuthCard>
  );
}
