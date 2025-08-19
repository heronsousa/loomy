"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { RemoveCartProductSchema,removeProductCartSchema } from "./schema";

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

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error("Cart item does not belong to the user");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
