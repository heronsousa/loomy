import { NextResponse } from "next/server";
import { addCartProducts } from "@/modules/cart";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await addCartProducts(data)

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}