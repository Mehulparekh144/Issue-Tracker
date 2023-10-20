"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface UserProps {
  image: string;
  name: string;
}

function UserDropDown({ image, name }: UserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-primary">
          <AvatarImage src={image} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2">
        <DropdownMenuLabel>
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel asChild>
          <Button
            variant={"ghost"}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropDown;
