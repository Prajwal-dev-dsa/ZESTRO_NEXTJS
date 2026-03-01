import ConnectDB from "@/lib/db";
import socketEmitEventHandler from "@/lib/socketEmitEventHandler";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();
    const { userId, items, totalAmount, address } = await request.json();
    if (!userId || !items || !totalAmount || !address) {
      return NextResponse.json(
        { message: `All fields are required` },
        { status: 400 },
      );
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const newOrder = await OrderModel.create({
      user: userId,
      items,
      totalAmount,
      address,
      paymentMethod: "online",
    });
    await socketEmitEventHandler("new-order", newOrder);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXTJS_URL}/user/checkout/order-placed`,
      cancel_url: `${process.env.NEXTJS_URL}/user/checkout/order-cancelled`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Zestro Order Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error in Payment" }, { status: 500 });
  }
}
