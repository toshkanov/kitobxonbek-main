import { setRequestLocale } from "next-intl/server";
import { getOrder } from "@/lib/api/orders";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Kutilmoqda", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Tasdiqlangan", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Tayyorlanmoqda", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Yo'lda", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Yetkazilgan", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Bekor qilingan", color: "bg-red-100 text-red-800" },
  refunded: { label: "Qaytarilgan", color: "bg-gray-100 text-gray-800" },
};

const paymentLabels: Record<string, string> = {
  click: "Click",
  payme: "Payme",
  cash: "Naqd",
  card: "Karta",
};

const deliveryLabels: Record<string, string> = {
  pickup: "O'zi olib ketish",
  courier: "Kuryer",
  post: "Pochta",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let order: Awaited<ReturnType<typeof getOrder>>;
  try {
    order = await getOrder(id);
  } catch {
    notFound();
  }

  if (!order) notFound();

  const statusInfo = statusLabels[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-800" };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="size-4" />
        Buyurtmalarim
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Buyurtma #{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(order.created_at).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-4">
        {/* Order items */}
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="size-4" /> Kitoblar
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium">{item.book_title}</p>
                  <p className="text-muted-foreground">
                    {item.format === "paperback" ? "Qog'oz" : item.format === "ebook" ? "Elektron" : "Audio"} × {item.quantity}
                  </p>
                </div>
                <span className="font-medium whitespace-nowrap">
                  {formatPrice(parseFloat(item.total_price), locale)} so&apos;m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery info */}
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Truck className="size-4" /> Yetkazib berish
          </h2>
          <p className="text-sm text-muted-foreground">
            {deliveryLabels[order.delivery_method] ?? order.delivery_method}
          </p>
          {order.delivery_address && Object.keys(order.delivery_address).length > 0 && (
            <div className="mt-2 text-sm flex items-start gap-2">
              <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <span>{JSON.stringify(order.delivery_address)}</span>
            </div>
          )}
        </div>

        {/* Payment summary */}
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="size-4" /> To&apos;lov
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">To&apos;lov usuli</span>
              <span>{paymentLabels[order.payment_method] ?? order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kitoblar</span>
              <span>{formatPrice(parseFloat(order.subtotal), locale)} so&apos;m</span>
            </div>
            {parseFloat(order.delivery_fee) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yetkazib berish</span>
                <span>{formatPrice(parseFloat(order.delivery_fee), locale)} so&apos;m</span>
              </div>
            )}
            {parseFloat(order.discount_amount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Chegirma</span>
                <span>-{formatPrice(parseFloat(order.discount_amount), locale)} so&apos;m</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2 mt-1">
              <span>Jami</span>
              <span>{formatPrice(parseFloat(order.total_amount), locale)} so&apos;m</span>
            </div>
          </div>
        </div>

        {order.customer_note && (
          <div className="border rounded-xl p-5">
            <h2 className="font-semibold mb-2">Izoh</h2>
            <p className="text-sm text-muted-foreground">{order.customer_note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
