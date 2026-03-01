import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
  }

  if (event?.type === "checkout.session.completed") {
    const session = event.data.object;
    await ConnectDB();
    await OrderModel.findByIdAndUpdate(session?.metadata?.orderId, {
      isPaid: true,
    });
  }
  return NextResponse.json({ message: "Webhook Success" }, { status: 200 });
}
