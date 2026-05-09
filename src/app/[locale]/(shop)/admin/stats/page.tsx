"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, ShoppingCart, BookOpen, Wallet } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { getAdminOverview, getAdminSales, getAdminTopBooks, type TopBook } from "@/lib/api/analytics";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg shrink-0">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold truncate">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminStatsPage() {
  const t = useTranslations("adminStats");
  const tCommon = useTranslations("common");
  const { user, fetchProfile } = useAuthStore();
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const isAdmin = useMemo(() => user?.role === "admin" || user?.role === "staff", [user?.role]);

  const overviewQ = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
    enabled: !!user,
    retry: 0,
  });

  const salesQ = useQuery({
    queryKey: ["admin-sales", period],
    queryFn: () => getAdminSales(period),
    enabled: !!user,
    retry: 0,
  });

  const topBooksQ = useQuery({
    queryKey: ["admin-top-books"],
    queryFn: () => getAdminTopBooks(10),
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

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted mb-4">
          <BarChart3 className="size-6" />
        </div>
        <p className="text-muted-foreground">{t("forbidden")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("subtitle")}</p>
        </div>
      </div>

      {overviewQ.isLoading ? (
        <div className="text-muted-foreground">{tCommon("loading")}</div>
      ) : overviewQ.isError || !overviewQ.data ? (
        <div className="text-muted-foreground">{tCommon("error")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label={t("cards.users")} value={overviewQ.data.total_users} />
          <StatCard icon={ShoppingCart} label={t("cards.orders")} value={overviewQ.data.total_orders} />
          <StatCard icon={Wallet} label={t("cards.revenue")} value={overviewQ.data.total_revenue} />
          <StatCard icon={BookOpen} label={t("cards.books")} value={overviewQ.data.total_books} />
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">{t("sales.title")}</CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <TabsList>
              <TabsTrigger value="week">{t("sales.week")}</TabsTrigger>
              <TabsTrigger value="month">{t("sales.month")}</TabsTrigger>
              <TabsTrigger value="year">{t("sales.year")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-2">
          {salesQ.isLoading ? (
            <div className="text-muted-foreground">{tCommon("loading")}</div>
          ) : salesQ.isError || !salesQ.data ? (
            <div className="text-muted-foreground">{tCommon("error")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={ShoppingCart} label={t("sales.totalSales")} value={salesQ.data.total_sales} />
              <StatCard icon={Wallet} label={t("sales.totalRevenue")} value={salesQ.data.total_revenue} />
              <StatCard icon={Wallet} label={t("sales.avgOrder")} value={salesQ.data.avg_order_value} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("topBooks.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {topBooksQ.isLoading ? (
            <div className="text-muted-foreground">{tCommon("loading")}</div>
          ) : topBooksQ.isError || !topBooksQ.data ? (
            <div className="text-muted-foreground">{tCommon("error")}</div>
          ) : topBooksQ.data.length === 0 ? (
            <div className="text-muted-foreground">{t("topBooks.empty")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">{t("topBooks.book")}</th>
                    <th className="py-2 pr-4">{t("topBooks.sold")}</th>
                    <th className="py-2 pr-4">{t("topBooks.views")}</th>
                    <th className="py-2 pr-4">{t("topBooks.revenue")}</th>
                  </tr>
                </thead>
                <tbody>
                  {topBooksQ.data.map((b: TopBook) => (
                    <tr key={b.id} className="border-t">
                      <td className="py-2 pr-4 font-medium">{b.title}</td>
                      <td className="py-2 pr-4">{b.sold_count}</td>
                      <td className="py-2 pr-4">{b.view_count}</td>
                      <td className="py-2 pr-4">{b.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

