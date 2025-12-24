import OrderModel from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await OrderModel.find({})
      .populate("user")
      .sort({ createdAt: -1 });
    if (!orders) {
      return NextResponse.json(
        { message: "Orders not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
