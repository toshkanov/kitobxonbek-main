"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { useAuthStore } from "@/stores/auth";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const register = useAuthStore((s) => s.register);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: RegisterInput) => {
    startTransition(async () => {
      try {
        const [firstName, lastName] = values.name.split(" ");
        await register({
          email: values.email,
          phone: "+998" + Math.random().toString().slice(2, 11),
          first_name: firstName || values.name,
          last_name: lastName || "",
          password: values.password,
          password_confirm: values.confirmPassword,
        });
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } catch {
        // error handled in store
      }
    });
  };

  return (
    <AuthCard
      title={t("title")}
      footer={
        <>
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-foreground font-semibold hover:underline">
            {t("loginLink")}
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" autoComplete="name" {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
          {form.formState.errors.name && (
            <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} aria-invalid={!!form.formState.errors.email} />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
            aria-invalid={!!form.formState.errors.confirmPassword}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-destructive text-xs">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? "..." : t("submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
