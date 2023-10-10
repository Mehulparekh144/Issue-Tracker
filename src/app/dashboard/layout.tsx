import DashboardNav from "@/components/dashboard/DashboardNav";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth-callback?origin=dashboard");
  }
  return (
    <div className="flex">
      <DashboardNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
