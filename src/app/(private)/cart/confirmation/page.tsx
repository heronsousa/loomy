import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/utils/formatAddress";

import { CartSummary, FinishOrder, getCartinfo } from "@/modules/cart";
import { getSessionUserId } from "@/lib/get-session-user-id";
import { getCartTotalInCents } from "@/utils/get-cart-total-in-cents";

const ConfirmationPage = async () => {
  const userId = await getSessionUserId();
  
    const cart = await getCartinfo(userId!);

  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }
  
  if (!cart.shippingAddress) {
    redirect("/cart/identification");
  }
  
  const cartTotalInCents = getCartTotalInCents(cart.items);

  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm">{formatAddress(cart.shippingAddress)}</p>
              </CardContent>
            </Card>
            <FinishOrder />
          </CardContent>
        </Card>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default ConfirmationPage;