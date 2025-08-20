"server only";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getOrders = async (userId: string) => {
  return await db.query.orderTable.findMany({
      where: eq(orderTable.userId, userId),
      with: {
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
}