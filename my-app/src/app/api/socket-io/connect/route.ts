import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDB();
  try {
    const { userId, socketId } = await req.json();
    const user = await UserModel.findByIdAndUpdate(userId, {
      socketId,
      isOnline: true,
    });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User Found" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Socket.io connect Server Error" },
      { status: 500 },
    );
  }
}
