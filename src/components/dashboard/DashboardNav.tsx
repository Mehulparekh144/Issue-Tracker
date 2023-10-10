"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

function DashboardNav() {
  const pathName = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Teams",
      link: "/dashboard/teams",
    },
    {
      name: "Add",
      link: "/dashboard/add",
    },
  ];

  return (
    <div className="h-[93vh] bg-zinc-100 dark:bg-zinc-900">
      <div className="h-full flex flex-col w-max items-center justify-between">
        <div className="flex-0 w-full flex flex-col items-center ">
          {navItems.map((item) => {
            const isActive = pathName.startsWith(item.link);

            return (
              // To do active name
              <Link
                href={item.link}
                key={item.name}
                className={`px-2 py-4 w-full text-sm dark:hover:bg-white/10 hover:bg-black/10 ${
                  isActive ? "" : ""
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="mb-4 flex w-full items-center gap-4 px-4">
          {session && session.user ? (
            <>
              <Avatar className="h-10 w-10 ring-2 ring-primary">
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback>{session?.user?.name ?? ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-sm">{session?.user?.name ?? ""}</h1>
                <h1 className="text-xs text-zinc-400 dark:text-zinc-600">
                  {session?.user?.email ?? ""}
                </h1>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-[161px]" />
                <Skeleton className="h-3 w-[161px]" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;
