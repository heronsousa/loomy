import { cartItemTable, productVariantTable } from "@/db/schema";

type Item = typeof cartItemTable.$inferSelect & {
  productVariant: typeof productVariantTable.$inferSelect;
};

export const getCartTotalInCents = (items: Item[]) => {
  return items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
};
