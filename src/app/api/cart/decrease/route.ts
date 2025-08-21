import { NextResponse } from "next/server";
import { decreaseCartProductQuantity } from "@/modules/cart";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await decreaseCartProductQuantity(data)

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}