import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();
    const session = await auth();
    const orders = await OrderModel.find({ user: session?.user?.id }).populate(
      "user"
    );
    if (!orders) {
      NextResponse.json({ message: "No orders found" }, { status: 400 });
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    NextResponse.json({ message: "Error in My Orders" }, { status: 500 });
  }
}
