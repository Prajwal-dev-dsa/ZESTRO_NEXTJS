import { auth } from "@/auth";
import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import EditRoleAndMobilePage from "@/components/EditRoleAndMobilePage";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/AdminDashboard";
import DeliveryBoyDashboard from "@/components/DeliveryBoyDashboard";
import UserDashboard from "@/components/UserDashboard";
import GeoLocationUpdater from "@/components/GeoLocationUpdater";
import Footer from "@/components/Footer";
import { IGrocery } from "@/components/GroceryItemCard";
import groceryModel from "@/models/grocery.model";


export default async function Home(props: {
  searchParams: Promise<{
    q: string
  }>
}) {
  const { q } = await props.searchParams
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
  let groceryList: IGrocery[] = [];
  if (user?.role === "user") {
    if (q) {
      groceryList = await groceryModel.find({
        $or: [
          { name: { $regex: q || "", $options: 'i' } },
          { description: { $regex: q || "", $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
    }
    else {
      groceryList = await groceryModel.find({}).sort({ createdAt: -1 })
    }
  }
  return (
    <>
      <Navbar user={plainJsonUser} />
      <GeoLocationUpdater userId={plainJsonUser?._id} />
      {plainJsonUser?.role === "user" && <UserDashboard groceryList={groceryList} />}
      {plainJsonUser?.role === "admin" && <AdminDashboard />}
      {plainJsonUser?.role === "deliveryBoy" && <DeliveryBoyDashboard />}
      <Footer />
    </>
  );
}
