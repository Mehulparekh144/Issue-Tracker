import DashboardNav from "@/components/dashboard/DashboardNav";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardSheet from "@/components/dashboard/DashboardSheet";


export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth-callback?origin=dashboard");
  } else if (session.user) {
    return (
      <div className="flex relative max-w-screen">
        <DashboardNav
          role={session.user.role}
          image={session.user.image ?? ""}
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
        />
        {/* Sheet */}
        <DashboardSheet
          role={session.user.role}
          image={session.user.image ?? ""}
          name={session.user.name ?? ""}
          email={session.user.email ?? ""}
        />
        <div className="flex-1 w-full lg:pl-[calc(18%-12px)]">{children}</div>
      </div>
    );
  }
}
