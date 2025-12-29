import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import socketEmitEventHandler from "@/lib/socketEmitEventHandler";
import deliveryModel from "@/models/delivery.model";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ConnectDB();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;
    if (!deliveryBoyId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const assignment = await deliveryModel.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "Assignment not found" },
        { status: 404 }
      );
    }
    if (assignment.status != "broadcasted") {
      return NextResponse.json(
        { message: "Assignment already accepted" },
        { status: 400 }
      );
    }
    const alreadyAssigned = await deliveryModel.findOne({
      assignedDeliveryBoy: deliveryBoyId,
      status: "assigned",
    });
    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "You are already assigned to this assignment" },
        { status: 400 }
      );
    }
    assignment.assignedDeliveryBoy = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();
    const order = await OrderModel.findById(assignment.order);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();
    await order.populate("assignedDeliveryBoy");
    await socketEmitEventHandler("assigned-order", {
      orderId: order._id,
      assignedDeliveryBoy: order.assignedDeliveryBoy,
    });
    await deliveryModel.updateMany(
      {
        _id: { $ne: id },
        totalDeliveryBoys: { $in: deliveryBoyId },
        status: "broadcasted",
      },
      { $pull: { totalDeliveryBoys: deliveryBoyId } }
    );
    return NextResponse.json(
      { message: "Assignment accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(`Failed to accept assignment: ${error}`);
    return NextResponse.json(
      { message: "Failed to accept assignment" },
      { status: 500 }
    );
  }
}
