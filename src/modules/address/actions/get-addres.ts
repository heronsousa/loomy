'use server';

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function getAddresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const addresses = await db
    .query
    .shippingAddressTable
    .findMany({
      where: eq(shippingAddressTable.userId, session.user.id)
    });

  return addresses;
}