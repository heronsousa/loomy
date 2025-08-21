import { NextResponse } from "next/server";
import { getCart } from "@/modules/cart";

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json(cart);
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}