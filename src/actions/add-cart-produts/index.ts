"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { addCartProductsSchema, AddCartProductsSchema } from "./schema";
import { eq } from "drizzle-orm";
import { cartItemTable, cartTable, productVariantTable } from "@/db/schema";
import { db } from "@/db";

export const addCartProducts = async (data: AddCartProductsSchema) => {
  addCartProductsSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });

  let cartId = cart?.id;

  if (!cartId) {
    const newCart = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning()
      .then((res) => res[0]);

    cartId = newCart.id;
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where:
      eq(cartItemTable.cartId, cartId) &&
      eq(cartItemTable.productVariantId, productVariant.id),
  });

  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));

      return;
  }

  await db
    .insert(cartItemTable)
    .values({
      cartId,
      productVariantId: productVariant.id,
      quantity: data.quantity,
    });
};
