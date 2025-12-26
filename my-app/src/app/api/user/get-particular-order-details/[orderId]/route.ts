import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await ConnectDB();
    const { orderId } = await params;
    const order = await OrderModel.findById(orderId).populate("assignedDeliveryBoy")
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.log(`Error in get-particular-order-details ${error}`);
    return NextResponse.json(
      { message: "Error in get-particular-order-details" },
      { status: 500 }
    );
  }
}
