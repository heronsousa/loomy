"server only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cartTable } from "@/db/schema";

export const getCartinfo = async (userId: string) => {
  return await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, userId),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
};
