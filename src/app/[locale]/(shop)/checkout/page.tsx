"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import { createOrder } from "@/lib/api/orders";
import { toast } from "sonner";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, totalAmount, clear } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({
    region: "",
    district: "",
    street: "",
    house_number: "",
    apartment: "",
    postal_code: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "courier" | "post">("courier");
  const [paymentMethod, setPaymentMethod] = useState<"click" | "payme" | "cash" | "card">("click");

  const deliveryFee = deliveryMethod === "courier" ? 30000 : 0;
  const total = totalAmount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        delivery_method: deliveryMethod,
        delivery_address: address,
        payment_method: paymentMethod,
      });
      clear();
      toast.success("Buyurtma yaratildi!");
      router.push(`/orders/${order.order_number}`);
    } catch {
      toast.error("Buyurtma yaratishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">{t("emptyCart")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t("address")}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("region")}</Label>
                <Input value={address.region} onChange={(e) => setAddress({ ...address, region: e.target.value })} required />
              </div>
              <div>
                <Label>{t("district")}</Label>
                <Input value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <Label>{t("street")}</Label>
                <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              </div>
              <div>
                <Label>{t("houseNumber")}</Label>
                <Input value={address.house_number} onChange={(e) => setAddress({ ...address, house_number: e.target.value })} required />
              </div>
              <div>
                <Label>{t("apartment")}</Label>
                <Input value={address.apartment} onChange={(e) => setAddress({ ...address, apartment: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t("deliveryMethod")}</h2>
            <div className="grid grid-cols-3 gap-4">
              {(["courier", "pickup", "post"] as const).map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={deliveryMethod === method ? "default" : "outline"}
                  onClick={() => setDeliveryMethod(method)}
                >
                  {t(method)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t("paymentMethod")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {(["click", "payme", "cash", "card"] as const).map((method) => (
                <Button
                  key={method}
                  type="button"
                  variant={paymentMethod === method ? "default" : "outline"}
                  onClick={() => setPaymentMethod(method)}
                >
                  {t(method)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">{t("orderSummary")}</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.bookTitle} x{item.quantity}</span>
                <span>{formatPrice(item.totalPrice, locale)} so&apos;m</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(totalAmount, locale)} so&apos;m</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between">
                <span>{t("deliveryFee")}</span>
                <span>{formatPrice(deliveryFee, locale)} so&apos;m</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>{t("total")}</span>
              <span>{formatPrice(total, locale)} so&apos;m</span>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "..." : t("placeOrder")}
          </Button>
        </div>
      </form>
    </div>
  );
}
