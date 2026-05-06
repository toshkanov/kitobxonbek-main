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
import { loginSchema, type LoginInput } from "@/validations/auth";
import { useAuthStore } from "@/stores/auth";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const login = useAuthStore((s) => s.login);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    startTransition(async () => {
      try {
        await login({ email: values.email, password: values.password });
        router.push("/profile");
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
          {t("noAccount")}{" "}
          <Link href="/register" className="text-foreground font-semibold hover:underline">
            {t("registerLink")}
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground text-xs">
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            aria-invalid={!!form.formState.errors.password}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? "..." : t("submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
