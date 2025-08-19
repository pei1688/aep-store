import { auth } from "@/lib/auth";
import AddressContent from "@/modules/address/ui/view/address-content";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

const UserAddressPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/sign-in");
  }

  return <AddressContent />;
};

export default UserAddressPage;
