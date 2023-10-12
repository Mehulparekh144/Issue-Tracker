"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Grip, LayoutDashboard, Plus, Users } from "lucide-react";
import DashboardNav from "./DashboardNav";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserProps {
  image: string;
  name: string;
  email: string;
}

function DashboardSheet({ image, email, name }: UserProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      name: "Teams",
      link: "/dashboard/teams",
      icon: <Users className="h-6 w-6" />,
    },
    {
      name: "Add",
      link: "/dashboard/add",
      icon: <Plus className="h-6 w-6" />,
    },
  ];
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(v: boolean) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <SheetTrigger
        className="lg:hidden absolute top-1"
        onClick={() => setIsOpen(true)}
        asChild
      >
        <Button variant={"ghost"} size={"sm"}>
          <Grip />
        </Button>
      </SheetTrigger>
      <SheetContent className="md:w-screen" side={"left"}>
        <div className="h-full flex flex-col w-max items-center justify-between">
          <div className="flex-0 w-full flex flex-col items-center ">
            {navItems.map((item) => {
              const isActive = pathName === item.link;

              return (
                <Link
                  href={item.link}
                  key={item.name}
                  onClick={()=>setIsOpen(false)}
                  className={`px-2 py-4 w-full text-sm flex items-center gap-3  ${
                    isActive
                      ? "bg-white text-primary font-semibold dark:bg-[#121212]"
                      : " dark:hover:bg-white/10 hover:bg-black/10"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="mb-4 flex w-full items-center gap-4 px-4">
            {
              <>
                <Avatar className="h-10 w-10 ring-2 ring-primary">
                  <AvatarImage src={image} />
                  <AvatarFallback>
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
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
      </SheetContent>
    </Sheet>
  );
}

export default DashboardSheet;