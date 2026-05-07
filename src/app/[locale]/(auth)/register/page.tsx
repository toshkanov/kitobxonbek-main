"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/shared/auth-card";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { useAuthStore } from "@/stores/auth";
import { cn } from "@/lib/utils";

function getStrength(value: string): { score: number; label: string; color: string } {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const labels = ["Juda zaif", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];
  const colors = [
    "bg-destructive",
    "bg-destructive",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-emerald-600",
  ];
  return { score, label: labels[score] ?? "", color: colors[score] ?? "bg-muted" };
}

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const register = useAuthStore((s) => s.register);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = form.watch("password");
  const strength = getStrength(password);

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
        subtitle="Bir necha soniyada hisobingizni yarating va kitoblar olamiga kiring"
        footer={
          <>
            {t("hasAccount")}{" "}
            <Link
              href="/login"
              className="text-foreground font-semibold hover:underline"
            >
              {t("loginLink")}
            </Link>
          </>
        }
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">{t("name")}</Label>
            <div className="relative">
              <User className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="name"
                autoComplete="name"
                placeholder="Ism Familiya"
                {...form.register("name")}
                aria-invalid={!!errors.name}
                className={cn("h-11 pl-10", errors.name && "border-destructive")}
              />
            </div>
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

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
                className={cn("h-11 pl-10", errors.email && "border-destructive")}
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">{t("password")}</Label>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
                aria-label={showPassword ? "Yashirish" : "Ko'rsatish"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {password && password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i < strength.score ? strength.color : "bg-muted",
                      )}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-xs">
                  Parol kuchi:{" "}
                  <span className="text-foreground font-medium">{strength.label}</span>
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                {...form.register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className={cn(
                  "h-11 pl-10 pr-10",
                  errors.confirmPassword && "border-destructive",
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                aria-label={showConfirm ? "Yashirish" : "Ko'rsatish"}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
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

          <p className="text-muted-foreground flex items-start gap-2 text-xs leading-relaxed">
            <Check className="text-emerald-500 mt-0.5 size-3.5 shrink-0" />
            <span>
              Ro'yxatdan o'tish orqali siz Foydalanuvchi shartnomasi va Maxfiylik
              siyosatini qabul qilasiz.
            </span>
          </p>
        </form>
      </AuthCard>
    </motion.div>
  );
}
