"use client";
import { cn } from "@/lib/utils";
import { Bug, Users } from "lucide-react";
import React from "react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

function AddNavbar() {
  const pathName = usePathname();
  const links = [
    {
      name: "New Team",
      href: "/dashboard/add/team",
      icon: <Users className="h-6 w-6 mr-2" />,
    },
    {
      name: "New Issue",
      href: "/dashboard/add/issue",
      icon: <Bug className="h-6 w-6 mr-2" />,
    },
  ];
  return (
    <div className="flex flex-row gap-2 flex-wrap mt-4 ">
      {links.map((item, index:number) => {
        const isActive = item.href === pathName
        return(
        <Link
          key={index}
          href={item.href}
          className={cn(
            buttonVariants({
              variant: isActive ? 'secondary' : 'ghost' ,
            }),
            `flex gap-1 items-center ${isActive ? 'ring-2 ring-primary text-primary font-semibold' : ''}`
          )}
        >
          {item.icon}
          {item.name}
        </Link>
        )
})}

    </div>
  );
}

export default AddNavbar;
