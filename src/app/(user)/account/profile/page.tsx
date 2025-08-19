import { getUserProfile } from "@/action/user/get";
import { auth } from "@/lib/auth";
import UserProfileContent from "@/modules/user/ui/views/user-profile-content";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const UserProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return redirect("/sign-in");
  }

  const profile = await getUserProfile();
  if (!profile) {
    return <div>尚未有個人資料</div>;
  }

  return <UserProfileContent profile={profile} />;
};

export default UserProfilePage;
