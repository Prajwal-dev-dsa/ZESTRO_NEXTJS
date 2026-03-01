import { auth } from "@/auth";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";
import { useRouter } from "next/navigation";

export default async function DeliveryBoy() {
  const router = useRouter()
  const session = await auth();

  if (!session?.user) {
    router.push("/unauthorized")
  }

  return (
    <>
      <DeliveryBoyDashboard />
    </>
  )
}