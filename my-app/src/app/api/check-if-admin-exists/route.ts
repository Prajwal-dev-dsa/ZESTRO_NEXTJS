import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await UserModel.find({ role: "admin" });
    if (!user) {
      return NextResponse.json({ isAdminExists: false }, { status: 200 });
    } else return NextResponse.json({ isAdminExists: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in Check if admin exists route` },
      { status: 500 }
    );
  }
}
