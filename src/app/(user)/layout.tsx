import { auth } from "@/lib/auth";
import UserSidebar from "@/modules/user/components/user-sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserLayoutFlexbox({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <div className="mt-16 flex flex-col items-center justify-center md:mt-32">
      <div className="mx-auto w-full max-w-7xl">
        {/* 使用 Flexbox 響應式佈局 */}
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* UserSidebar - 手機版在上方，桌面版在左側 */}
          <div className="md:w-[300px] md:flex-shrink-0">
            <UserSidebar user={session.user} />
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 md:p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
