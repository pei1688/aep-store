import { auth } from "@/lib/auth";
import OrderContent from "@/modules/order/ui/views/order-content";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const OdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/sign-in");
  }

  return <OrderContent />;
};

export default OdersPage;
