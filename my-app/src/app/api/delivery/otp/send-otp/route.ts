import ConnectDB from "@/lib/db";
import { sendMail } from "@/lib/node.mailer";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is Required" },
        { status: 400 },
      );
    }

    const order = await OrderModel.findById(orderId).populate("user");

    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }

    // Generate strict 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    order.OTP = otp;
    await order.save();

    // --- PROFESSIONAL EMAIL TEMPLATE ---
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin: 0;">Delivery Verification</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Order #${order._id
              .toString()
              .slice(-6)}</p>
          </div>

          <p style="font-size: 16px; color: #334155; line-height: 1.5; text-align: center;">
            Your order is at your doorstep! Please share the code below with the delivery partner to complete your delivery.
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 15px 30px; border: 2px dashed #bfdbfe; border-radius: 12px;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 20px;">
            If you did not request this, please contact support immediately.
          </p>
          
          <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #cbd5e1;">© ${new Date().getFullYear()} Zestro. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    await sendMail(
      order.user.email,
      `Delivery OTP: ${otp}`, // Subject line updated to be more useful
      emailHtml,
    );

    return NextResponse.json(
      { message: "OTP Sent Successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error in SendMail route ${error}` },
      { status: 500 },
    );
  }
}
