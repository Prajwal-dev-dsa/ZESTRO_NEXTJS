import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groceryId } = await req.json();

    if (!groceryId) {
      return NextResponse.json(
        { error: "Grocery ID is required" },
        { status: 400 },
      );
    }

    const grocery = await groceryModel.findByIdAndDelete(groceryId);

    if (!grocery) {
      return NextResponse.json(
        { message: "Grocery Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete grocery ${error}` },
      { status: 500 },
    );
  }
}
