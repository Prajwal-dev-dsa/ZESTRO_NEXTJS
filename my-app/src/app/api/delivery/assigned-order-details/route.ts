import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ConnectDB();
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const activeAssignmentForDeliveryBoy = await OrderModel.find({
      assignedDeliveryBoy: deliveryBoyId,
    })
      .populate("assignedDeliveryBoy")
      .populate("user")
      .populate("items.grocery")
      .lean();
    return NextResponse.json(activeAssignmentForDeliveryBoy, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in get-all-order-assignments route" },
      { status: 500 }
    );
  }
}
