import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { getSessionUserId } from "@/lib/get-session-user-id";
import { Addresses } from "@/modules/address";
import { CartSummary, getCartinfo } from "@/modules/cart";
import { getCartTotalInCents } from "@/utils/get-cart-total-in-cents";

const IdentificationPage = async () => {
  const userId = await getSessionUserId();

  const cart = await getCartinfo(userId!);

  if (!cart || !cart.items.length) {
    redirect("/");
  }

  const cartTotalInCents = getCartTotalInCents(cart.items);

  return (
    <div className="space-y-12">
      <Header />

      <div className="space-y-4 px-5">
        <Addresses defaultShippingAddressId={cart.shippingAddressId || null} />

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

      <Footer />
    </div>
  );
};

export default IdentificationPage;
