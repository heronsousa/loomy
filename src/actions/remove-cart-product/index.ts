"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { removeProductCartSchema, RemoveCartProductSchema } from "./schema";
import { cartItemTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export const removeCartProduct = async (data: RemoveCartProductSchema) => {
  removeProductCartSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {
      cart: true,
    },
  });

  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;
  
  if (cartDoesNotBelongToUser) {
    throw new Error("Cart item does not belong to the user");
  }

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
