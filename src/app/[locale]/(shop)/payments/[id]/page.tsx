"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { getPaymentStatus } from "@/lib/api/payments";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const q = useQuery({
    queryKey: ["payment-status", params.id],
    queryFn: () => getPaymentStatus(params.id),
    enabled: !!user,
    retry: 0,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">{t("loginRequired")}</p>
        <Link href="/login">
          <Button>{t("login")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t("paymentId", { id: params.id })}
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <CardTitle className="text-base">{t("details")}</CardTitle>
        </CardHeader>
        <CardContent>
          {q.isLoading ? (
            <div className="text-muted-foreground">{tCommon("loading")}</div>
          ) : q.isError || !q.data ? (
            <div className="text-muted-foreground">{tCommon("error")}</div>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">{t("fields.provider")}</dt>
                <dd className="font-medium">{q.data.provider}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("fields.status")}</dt>
                <dd className="font-medium">{q.data.status}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("fields.amount")}</dt>
                <dd className="font-medium">{q.data.amount}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("fields.createdAt")}</dt>
                <dd className="font-medium">{new Date(q.data.created_at).toLocaleString()}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

