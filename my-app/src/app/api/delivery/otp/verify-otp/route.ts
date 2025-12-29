import ConnectDB from "@/lib/db";
import socketEmitEventHandler from "@/lib/socketEmitEventHandler";
import deliveryModel from "@/models/delivery.model";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      NextResponse.json(
        { message: "Order ID and OTP are Required" },
        { status: 400 }
      );
    }
    const order = await OrderModel.findById(orderId).populate("user");
    if (!order) {
      NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }
    if (Number(order.OTP) !== Number(otp)) {
      NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    order.isOtpVerifed = true;
    order.deliveredAt = Date.now();
    order.OTP = null;
    order.status = "delivered";
    await order.save();

    await deliveryModel.updateOne(
      {
        order: orderId,
      },
      {
        $set: {
          assignedDeliveryBoy: null,
          status: "completed",
        },
      }
    );

    await socketEmitEventHandler("update-order-status", {
      orderId: order._id,
      status: order.status,
    });

    return NextResponse.json(
      { message: "OTP Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error in VerifyMail route ${error}` },
      { status: 500 }
    );
  }
}
