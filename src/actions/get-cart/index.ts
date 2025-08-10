'use server';

import { cartTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
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

  if (!cart) {
    const newCart = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning()
      .then((res) => res[0]);

    return {
      ...newCart,
      items: [],
    };
  }
 
  return cart;
}