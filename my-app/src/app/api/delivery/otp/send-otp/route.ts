import ConnectDB from "@/lib/db";
import { sendMail } from "@/lib/node.mailer";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { orderId } = await req.json();
    if (!orderId) {
      NextResponse.json({ message: "Order ID is Required" }, { status: 400 });
    }
    const order = await OrderModel.findById(orderId).populate("user");
    if (!order) {
      NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }
    const otp = Math.floor(1000 + Math.random() * 9999).toString();
    order.OTP = otp;
    await order.save();

    await sendMail(
      order.user.email,
      "Your Delivery OTP",
      `<h1>Your Delivery OTP is <strong>${otp}</strong></h1>`
    );

    return NextResponse.json(
      { message: "OTP Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error in SendMail route ${error}` },
      { status: 500 }
    );
  }
}
