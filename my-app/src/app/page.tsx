import { auth } from "@/lib/auth";
import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import EditRoleAndMobilePage from "@/components/EditRoleAndMobilePage";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoyDashboard from "@/components/DeliveryBoyDashboard";
import UserDashboard from "@/components/UserDashboard";


export default async function Home() {
  await ConnectDB();
  const session = await auth();
  const user = await UserModel.findById(session?.user?.id);
  if (!user) redirect("/login");
  if (!user?.mobile && user?.role === "user") {
    return (
      <>
        <EditRoleAndMobilePage />
      </>
    );
  }
  const plainJsonUser = JSON.parse(JSON.stringify(user))
  return (
    <>
      <Navbar user={plainJsonUser} />
      {user?.role === "user" && <UserDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "deliveryBoy" && <DeliveryBoyDashboard />}
    </>
  );
}
