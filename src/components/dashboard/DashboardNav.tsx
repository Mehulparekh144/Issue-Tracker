"use client";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LayoutDashboard, Users, Plus, User, UserCog } from "lucide-react";
import { usePathname } from "next/navigation";
import { PersonIcon } from "@radix-ui/react-icons";

interface UserProps {
  image: string;
  name: string;
  email: string;
  role: string;
}

function DashboardNav({ image, name, email, role }: UserProps) {
  const pathName = usePathname();
  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
      isAdmin: false,
    },
    {
      name: "Teams",
      link: "/dashboard/teams",
      icon: <Users className="h-6 w-6" />,
      isAdmin: false,
    },
    {
      name: "Add",
      link: "/dashboard/add",
      icon: <Plus className="h-6 w-6" />,
      isAdmin: true,
    },
    {
      name: "Users",
      link: "/dashboard/users",
      icon: <UserCog className="h-6 w-6" />,
      isAdmin: true,
    },
    {
      name: "Profile",
      link: "/dashboard/profile",
      icon: <User className="h-6 w-6" />,
      isAdmin: false,
    },
  ];

  return (
    <div className="hidden fixed z-10 lg:block h-[93vh] bg-zinc-100 dark:bg-zinc-900">
      <div className="h-full flex flex-col w-max items-center justify-between">
        <div className="flex-0 w-full flex flex-col items-center ">
          {navItems.map((item) => {
            const isActive =
              pathName === item.link ||
              (item.link === "/dashboard/add" && pathName.includes(item.link))

            if (item.isAdmin && role === "ADMIN") {
              return (
                <Link
                  href={item.link}
                  key={item.name}
                  className={`px-2 py-4 w-full text-sm flex items-center gap-3  ${
                    isActive
                      ? "bg-white text-primary font-semibold dark:bg-[#121212]"
                      : " dark:hover:bg-white/10 hover:bg-black/10"
                  } `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            } else if (!item.isAdmin) {
              return (
                <Link
                  href={item.link}
                  key={item.name}
                  className={`px-2 py-4 w-full text-sm flex items-center gap-3  ${
                    isActive
                      ? "bg-white text-primary font-semibold dark:bg-[#121212]"
                      : " dark:hover:bg-white/10 hover:bg-black/10"
                  } `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            }
          })}
        </div>
        <div className="mb-4 flex w-full items-center gap-4 px-4">
          {
            <>
              <Avatar className="h-10 w-10 ring-2 ring-primary">
                <AvatarImage src={image} />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-sm">{name}</h1>
                <h1 className="text-xs text-zinc-400 dark:text-zinc-600">
                  {email}
                </h1>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}
// }

export default DashboardNav;
