import ConnectDB from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import GroceryModel from "@/models/grocery.model";

// Force dynamic rendering so data is always fresh
export const dynamic = 'force-dynamic';

async function AdminDashboard() {
  await ConnectDB();

  // 1. Fetch Basic Counts
  const totalOrders = await OrderModel.countDocuments({});
  const totalCustomers = await UserModel.countDocuments({ role: "user" });
  const totalGroceries = await GroceryModel.countDocuments({});
  const pendingDeliveries = await OrderModel.countDocuments({ status: "pending" });

  // 2. Calculate Revenue (Total)
  const allOrders = await OrderModel.find({});
  const totalRevenue = allOrders.reduce((sum, acc) => (sum + (acc.totalAmount || 0)), 0);

  // 3. Calculate Revenue (Today)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = await OrderModel.find({ createdAt: { $gte: todayStart } });
  const revenueToday = todayOrders.reduce((sum, acc) => (sum + (acc.totalAmount || 0)), 0);

  // 4. Calculate Revenue (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const lastWeekOrders = await OrderModel.find({ createdAt: { $gte: sevenDaysAgo } });
  const revenueLast7Days = lastWeekOrders.reduce((sum, acc) => (sum + (acc.totalAmount || 0)), 0);

  // 5. Prepare Chart Data (Last 7 Days)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const count = await OrderModel.countDocuments({
      createdAt: { $gte: date, $lt: nextDay }
    });

    chartData.push({
      name: date.toLocaleDateString("en-US", { weekday: "short" }), // Mon, Tue...
      orders: count,
    });
  }

  // 6. Stats Array for the Cards
  const stats = [
    { title: "Total Orders", value: totalOrders, icon: "package" },
    { title: "Total Customers", value: totalCustomers, icon: "users" },
    { title: "Total Groceries", value: totalGroceries, icon: "shopping-bag" },
    { title: "Pending Deliveries", value: pendingDeliveries, icon: "truck" },
  ];

  return (
    <>
      <AdminDashboardClient
        stats={stats}
        revenue={{
          total: totalRevenue,
          today: revenueToday,
          sevenDays: revenueLast7Days
        }}
        chartData={chartData}
      />
    </>
  );
}

export default AdminDashboard;