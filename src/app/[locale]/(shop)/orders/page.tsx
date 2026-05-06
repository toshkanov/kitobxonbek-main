import { setRequestLocale, getTranslations } from "next-intl/server";
import { getOrders } from "@/lib/api/orders";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  processing: "Tayyorlanmoqda",
  shipped: "Yo'lda",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
  refunded: "Qaytarilgan",
};

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("orders");

  let orders: { id: string; order_number: string; status: string; total_amount: string; created_at: string; items: { book_title: string; quantity: number }[] }[] = [];

  try {
    orders = await getOrders();
  } catch {
    // ignore
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="mb-4">{t("empty")}</p>
          <Link href="/books">
            <Button>{t("browseBooks")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">{order.order_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString(locale)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "delivered" ? "bg-green-100 text-green-800" :
                  order.status === "cancelled" ? "bg-red-100 text-red-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="space-y-1 mb-4">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm">
                    {item.book_title} x{item.quantity}
                  </p>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">{formatPrice(parseFloat(order.total_amount), locale)} so'm</span>
                <Link href={`/orders/${order.order_number}`}>
                  <Button variant="outline" size="sm">{t("details")}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
