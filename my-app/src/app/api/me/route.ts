import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({
      email: session?.user?.email,
    }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error in Me Route` }, { status: 500 });
  }
}
