import { auth } from "@/lib/auth";
import ConnectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import EditRoleAndMobilePage from "@/components/EditRoleAndMobilePage";
import { redirect } from "next/navigation";

export default async function Home() {
  await ConnectDB();
  const session = await auth();
  const user = await UserModel.findById(session?.user?.id);
  if (!user) redirect("/login");
  if (!user?.mobile && user?.role === "user") {
    return (
      <div>
        <EditRoleAndMobilePage />
      </div>
    );
  }
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
