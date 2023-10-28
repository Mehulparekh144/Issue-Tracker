import React, { ReactNode } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

async function layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role != "ADMIN") {
    return (
      <MaxWidthWrapper className="max-w-screen mt-24 flex flex-col space-y-3 items-center justify-center">
        <h1 className="text-xl md:text-3xl font-display">Access Denied</h1>
        <p className="text-sm text-zinc-800 dark:text-zinc-400">
          You don&apos;t have the permission
        </p>
        <Link href={"/dashboard"} className="underline text-sm text-primary">Go back to dashboard</Link>
      </MaxWidthWrapper>
    );
  } else {
    return <div className="w-full">{children}</div>;
  }
}

export default layout;
