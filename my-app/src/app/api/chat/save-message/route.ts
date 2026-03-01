import ConnectDB from "@/lib/db";
import MessageModel from "@/models/message.model";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { roomId, text, senderId, time } = await req.json();
    if (!roomId || !text || !senderId || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const room = await OrderModel.findById(roomId);
    if (!room) {
      return NextResponse.json(
        { error: "Room (Order) not found" },
        { status: 404 },
      );
    }

    const message = await MessageModel.create({
      roomId,
      text,
      senderId,
      time,
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Server Error: ${error.message}` },
      { status: 500 },
    );
  }
}
