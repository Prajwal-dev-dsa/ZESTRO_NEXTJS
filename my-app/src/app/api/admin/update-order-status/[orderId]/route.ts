import ConnectDB from "@/lib/db";
import socketEmitEventHandler from "@/lib/socketEmitEventHandler";
import deliveryModel from "@/models/delivery.model";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await ConnectDB();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await OrderModel.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "Order Not Found" }, { status: 404 });
    }
    order.status = status;
    let deliveryBoysPayload: any = [];
    if (status === "out of delivery" && !order.orderAssignment) {
      const { latitude, longitude } = order.address;
      const nearestDeliveryBoys = await UserModel.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 10000000000, // currently done this much for testing purposes
          },
        },
      });
      const nearestDeliveryBoysIds = nearestDeliveryBoys.map(
        (deliveryBoy) => deliveryBoy._id
      );
      const busyDeliveryBoysIds = await deliveryModel
        .find({
          assignedDeliveryBoy: { $in: nearestDeliveryBoysIds },
          status: { $nin: ["broadcasted", "completed"] },
        })
        .distinct("assignedDeliveryBoy");
      const availableDeliveryBoys = nearestDeliveryBoys.filter(
        (deliveryBoy) => !busyDeliveryBoysIds.includes(deliveryBoy._id)
      );
      const availableDeliveryBoysIds = availableDeliveryBoys.map(
        (deliveryBoy) => deliveryBoy._id
      );
      if (availableDeliveryBoys.length == 0) {
        order.save();
        order.orderAssignment = null;
        await socketEmitEventHandler("update-order-status", {
          orderId: order._id,
          status: order.status,
        });
        return NextResponse.json(
          { message: "No Delivery Boy Found, Try Again Later" },
          { status: 200 }
        );
      }
      const deliveryAssignment = await deliveryModel.create({
        order: order._id,
        totalDeliveryBoys: availableDeliveryBoysIds,
        status: "broadcasted",
      });
      order.orderAssignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((deliveryBoy) => ({
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        mobile: deliveryBoy.mobile,
        latitude: deliveryBoy.location.coordinates[1],
        longitude: deliveryBoy.location.coordinates[0],
      }));
      await deliveryAssignment.populate("order");
      for (const deliveryBoy of availableDeliveryBoys) {
        if (deliveryBoy.socketId) {
          await socketEmitEventHandler(
            "new-order-assignment",
            deliveryAssignment,
            deliveryBoy.socketId
          );
        }
      }
    }
    await order.save();
    await order.populate("user");
    await socketEmitEventHandler("update-order-status", {
      orderId: order._id,
      status: order.status,
    });
    return NextResponse.json(
      {
        assignment: order.orderAssignment?._id,
        availableDeliveryBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error in updating order status" },
      { status: 500 }
    );
  }
}
