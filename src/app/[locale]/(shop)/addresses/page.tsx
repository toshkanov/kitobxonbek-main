"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import type { Address } from "@/lib/api/auth";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "@/lib/api/auth";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const emptyDraft: Omit<Address, "id"> = {
  title: "",
  region: "",
  district: "",
  street: "",
  house_number: "",
  apartment: "",
  postal_code: "",
  is_default: false,
  latitude: null,
  longitude: null,
};

export default function AddressesPage() {
  const t = useTranslations("addresses");
  const tCommon = useTranslations("common");
  const { user, fetchProfile } = useAuthStore();
  const qc = useQueryClient();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
    enabled: !!user,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [draft, setDraft] = useState<Omit<Address, "id">>(emptyDraft);

  const dialogTitle = useMemo(
    () => (editing ? t("editTitle") : t("addTitle")),
    [editing, t],
  );

  const addMut = useMutation({
    mutationFn: addAddress,
    onSuccess: async () => {
      toast.success(t("saved"));
      await qc.invalidateQueries({ queryKey: ["addresses"] });
      setOpen(false);
      setDraft(emptyDraft);
      setEditing(null);
    },
    onError: () => toast.error(tCommon("error")),
  });

  const updateMut = useMutation({
    mutationFn: (vars: { id: string; patch: Partial<Address> }) => updateAddress(vars.id, vars.patch),
    onSuccess: async () => {
      toast.success(t("saved"));
      await qc.invalidateQueries({ queryKey: ["addresses"] });
      setOpen(false);
      setDraft(emptyDraft);
      setEditing(null);
    },
    onError: () => toast.error(tCommon("error")),
  });

  const deleteMut = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      toast.success(t("deleted"));
      await qc.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => toast.error(tCommon("error")),
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

  const onOpenAdd = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const onOpenEdit = (addr: Address) => {
    setEditing(addr);
    const { id: _id, ...rest } = addr;
    setDraft(rest);
    setOpen(true);
  };

  const onSave = () => {
    if (!draft.title.trim() || !draft.region.trim() || !draft.district.trim() || !draft.street.trim()) {
      toast.error(t("fillRequired"));
      return;
    }
    if (editing) updateMut.mutate({ id: editing.id, patch: draft });
    else addMut.mutate(draft);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button onClick={onOpenAdd} className="w-full">
              <Plus className="mr-2 size-4" />
              {t("add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("fields.title")}</Label>
                <Input id="title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">{t("fields.postal")}</Label>
                <Input id="postal" value={draft.postal_code} onChange={(e) => setDraft((d) => ({ ...d, postal_code: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">{t("fields.region")}</Label>
                <Input id="region" value={draft.region} onChange={(e) => setDraft((d) => ({ ...d, region: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{t("fields.district")}</Label>
                <Input id="district" value={draft.district} onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="street">{t("fields.street")}</Label>
                <Input id="street" value={draft.street} onChange={(e) => setDraft((d) => ({ ...d, street: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="house">{t("fields.house")}</Label>
                <Input id="house" value={draft.house_number} onChange={(e) => setDraft((d) => ({ ...d, house_number: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">{t("fields.apartment")}</Label>
                <Input id="apartment" value={draft.apartment} onChange={(e) => setDraft((d) => ({ ...d, apartment: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2 pt-1">
                <Checkbox
                  id="default"
                  checked={!!draft.is_default}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, is_default: Boolean(v) }))}
                />
                <Label htmlFor="default">{t("fields.default")}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button
                onClick={onSave}
                disabled={addMut.isPending || updateMut.isPending}
              >
                {tCommon("save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">{tCommon("loading")}</div>
      ) : addresses.length === 0 ? (
        <div className="text-muted-foreground">{t("empty")}</div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="bg-primary/10 text-primary grid size-10 place-items-center rounded-lg shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{a.title}</h3>
                    {a.is_default && (
                      <span className="text-xs rounded-md bg-muted px-2 py-0.5">
                        {t("defaultBadge")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {a.region}, {a.district}, {a.street} {a.house_number}
                    {a.apartment ? `, ${t("apt")} ${a.apartment}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label={tCommon("edit")} onClick={() => onOpenEdit(a)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={tCommon("delete")}
                    onClick={() => deleteMut.mutate(a.id)}
                    disabled={deleteMut.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

