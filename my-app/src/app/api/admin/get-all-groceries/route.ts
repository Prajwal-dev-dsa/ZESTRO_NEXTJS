import ConnectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();
    const groceries = await groceryModel.find({});
    if (!groceries || groceries.length === 0) {
      return NextResponse.json(
        { message: "No Groceries Found" },
        { status: 404 },
      );
    }
    return NextResponse.json(groceries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in get-all-groceries ${error}` },
      { status: 500 },
    );
  }
}
