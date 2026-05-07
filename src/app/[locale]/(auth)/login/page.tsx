"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";
import { loginSchema, type LoginInput } from "@/validations/auth";
import { useAuthStore } from "@/stores/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
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
        // toast handled in store
      }
    });
  };

  const errors = form.formState.errors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <AuthCard
        title={t("title")}
        subtitle="Kitoblaringiz, buyurtmalaringiz va sevimlilaringiz sizni kutmoqda"
        footer={
          <>
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="text-foreground font-semibold hover:underline"
            >
              {t("registerLink")}
            </Link>
          </>
        }
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("email")}</Label>
            <div className="relative">
              <Mail className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                {...form.register("email")}
                aria-invalid={!!errors.email}
                className={cn("pl-10 h-11", errors.email && "border-destructive")}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...form.register("password")}
                aria-invalid={!!errors.password}
                className={cn(
                  "h-11 pl-10 pr-10",
                  errors.password && "border-destructive",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="group h-11 w-full gap-2 rounded-xl text-sm font-semibold"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("submit")}
              </>
            ) : (
              <>
                {t("submit")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>
      </AuthCard>
    </motion.div>
  );
}
