'use server';

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddAddressSchema,addAddressSchema } from "./schema";

export async function addAddress(input: AddAddressSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const data = addAddressSchema.parse(input);

  const [shippingAddress] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: `${data.firstName} ${data.lastName}`,
      street: data.address,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      zipCode: data.zipCode,
      country: "Brasil",
      phone: data.phone,
      email: data.email,
      cpfOrCnpj: data.cpf,
    })
    .returning();

  revalidatePath("/cart/identification");

  return shippingAddress;
}