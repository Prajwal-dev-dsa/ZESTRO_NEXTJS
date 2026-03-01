import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import deliveryModel from "@/models/delivery.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();
    const session = await auth();
    const assignments = await deliveryModel
      .find({
        totalDeliveryBoys: session?.user?.id,
        status: "broadcasted",
      })
      .populate("order");
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in get-all-order-assignments route ${error}` },
      { status: 500 },
    );
  }
}
