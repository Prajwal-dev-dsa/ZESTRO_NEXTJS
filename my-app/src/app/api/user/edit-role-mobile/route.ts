import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { role, mobile } = await req.json();
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await UserModel.findByIdAndUpdate(
      session?.user?.id,
      { role, mobile },
      { new: true }
    );
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
