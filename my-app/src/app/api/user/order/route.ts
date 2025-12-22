import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await ConnectDB();
    const { userId, items, totalAmount, address } = await request.json();
    if (!userId || !items || !totalAmount || !address) {
      return NextResponse.json(
        { message: `All fields are required` },
        { status: 400 }
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
    });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in creating order" },
      { status: 500 }
    );
  }
}
