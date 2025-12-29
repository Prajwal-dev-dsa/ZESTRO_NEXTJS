import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ConnectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Cast ID to ObjectId (Crucial for matching)
    const deliveryBoyId = new mongoose.Types.ObjectId(session.user.id);

    // 2. Calculate Start of Today (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 3. Get Today's Orders
    const todaysOrdersCount = await OrderModel.countDocuments({
      assignedDeliveryBoy: deliveryBoyId,
      status: "delivered",
      deliveredAt: { $gte: startOfToday },
    });

    const todaysEarning = todaysOrdersCount * 100;

    // 4. Get Last 7 Days Data
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const dateStart = new Date();
      dateStart.setDate(dateStart.getDate() - i);
      dateStart.setHours(0, 0, 0, 0);

      const dateEnd = new Date(dateStart);
      dateEnd.setDate(dateEnd.getDate() + 1);

      const count = await OrderModel.countDocuments({
        assignedDeliveryBoy: deliveryBoyId,
        status: "delivered",
        deliveredAt: { $gte: dateStart, $lt: dateEnd },
      });

      chartData.push({
        name: dateStart.toLocaleDateString("en-US", { weekday: "short" }),
        deliveries: count,
      });
    }

    return NextResponse.json(
      {
        todaysOrders: todaysOrdersCount,
        todaysEarning,
        chartData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
