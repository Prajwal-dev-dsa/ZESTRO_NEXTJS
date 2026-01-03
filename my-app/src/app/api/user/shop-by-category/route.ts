import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import groceryModel from "@/models/grocery.model";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();
    const { category } = await req.json();
    const grocery = await groceryModel.find({ category });
    if (!grocery) {
      return NextResponse.json(`Grocery of this Category doesn't exist`, {
        status: 200,
      });
    }
    return NextResponse.json(grocery, { status: 200 });
  } catch (error) {
    return NextResponse.json(`Error in fetching grocery`, { status: 500 });
  }
}
