"use client";

import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/api/notifications";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const { user, fetchProfile } = useAuthStore();
  const qc = useQueryClient();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    enabled: !!user,
  });

  const { data: prefs, isLoading: prefsLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: getNotificationPreferences,
    enabled: !!user,
  });

  const markOneMut = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error(tCommon("error")),
  });

  const markAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      toast.success(t("allRead"));
      await qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error(tCommon("error")),
  });

  const updatePrefsMut = useMutation({
    mutationFn: (patch: Partial<NotificationPreferences>) => updateNotificationPreferences(patch),
    onSuccess: async () => {
      toast.success(t("prefsSaved"));
      await qc.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
    onError: () => toast.error(tCommon("error")),
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? t("unread", { count: unreadCount }) : t("noUnread")}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => markAllMut.mutate()}
          disabled={markAllMut.isPending || unreadCount === 0}
        >
          <CheckCheck className="mr-2 size-4" />
          {t("markAllRead")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prefsLoading ? (
            <div className="text-muted-foreground">{tCommon("loading")}</div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="email_orders"
                    checked={!!prefs?.email_orders}
                    onCheckedChange={(v) => updatePrefsMut.mutate({ email_orders: Boolean(v) })}
                    disabled={updatePrefsMut.isPending}
                  />
                  <Label htmlFor="email_orders">{t("prefs.emailOrders")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="email_promos"
                    checked={!!prefs?.email_promos}
                    onCheckedChange={(v) => updatePrefsMut.mutate({ email_promos: Boolean(v) })}
                    disabled={updatePrefsMut.isPending}
                  />
                  <Label htmlFor="email_promos">{t("prefs.emailPromos")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sms_orders"
                    checked={!!prefs?.sms_orders}
                    onCheckedChange={(v) => updatePrefsMut.mutate({ sms_orders: Boolean(v) })}
                    disabled={updatePrefsMut.isPending}
                  />
                  <Label htmlFor="sms_orders">{t("prefs.smsOrders")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="push_enabled"
                    checked={!!prefs?.push_enabled}
                    onCheckedChange={(v) => updatePrefsMut.mutate({ push_enabled: Boolean(v) })}
                    disabled={updatePrefsMut.isPending}
                  />
                  <Label htmlFor="push_enabled">{t("prefs.push")}</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram">{t("prefs.telegram")}</Label>
                <Input
                  id="telegram"
                  placeholder="@username yoki chat id"
                  defaultValue={prefs?.telegram_chat_id ?? ""}
                  onBlur={(e) => updatePrefsMut.mutate({ telegram_chat_id: e.target.value || null })}
                  disabled={updatePrefsMut.isPending}
                />
                <p className="text-xs text-muted-foreground">{t("prefsHint")}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-muted-foreground">{tCommon("loading")}</div>
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground">{t("empty")}</div>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className={!n.is_read ? "border-primary/40" : undefined}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg shrink-0">
                  <Bell className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{n.title ?? t("noTitle")}</h3>
                    {!n.is_read && (
                      <span className="text-xs rounded-md bg-primary/10 text-primary px-2 py-0.5">
                        {t("new")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {n.message ?? n.body ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("markRead")}
                    onClick={() => markOneMut.mutate(n.id)}
                    disabled={markOneMut.isPending}
                  >
                    <Check className="size-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

