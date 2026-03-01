import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await ConnectDB();
  try {
    const { userId, location } = await req.json();

    if (!userId || !location) {
      return NextResponse.json(
        { message: "Fill all the fields" },
        { status: 400 },
      );
    }

    const user = await UserModel.findByIdAndUpdate(userId, {
      location,
    });

    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Location Updated" }, { status: 200 });
  } catch (error: any) {
    console.error("Mongoose Update Error:", error);

    return NextResponse.json(
      { message: "Update Location Server Error", error: error.message },
      { status: 500 },
    );
  }
}
