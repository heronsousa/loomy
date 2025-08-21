import { NextResponse } from "next/server";
import { removeCartProduct } from "@/modules/cart";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await removeCartProduct(data)

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}