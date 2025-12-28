import ConnectDB from "@/lib/db";
import MessageModel from "@/models/message.model";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { roomId } = await req.json();
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }
    const room = await OrderModel.findById(roomId);
    if (!room || room.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const messages = await MessageModel.find({ roomId: roomId });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error in Get Room Messages Route" },
      { status: 500 }
    );
  }
}
