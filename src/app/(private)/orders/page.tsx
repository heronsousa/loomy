import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getSessionUserId } from "@/lib/get-session-user-id";
import { getOrders,Orders } from "@/modules/orders";

const OrdersPage = async ({ }) => {
  const userId = await getSessionUserId();

  const orders = await getOrders(userId!);

  return (
    <>
      <Header />

      <div className="px-5">
        <Orders
          orders={orders.map((order) => ({
            id: order.id,
            totalPriceInCents: order.totalPriceInCents,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
              id: item.id,
              imageUrl: item.productVariant.imageUrl,
              productName: item.productVariant.product.name,
              productVariantName: item.productVariant.name,
              priceInCents: item.productVariant.priceInCents,
              quantity: item.quantity,
            })),
          }))}
        />
      </div>

      <Footer />
    </>
  );
};

export default OrdersPage;
