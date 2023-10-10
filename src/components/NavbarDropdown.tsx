import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Menu, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignupButton from "./SignupButton";
import Link from "next/link";

function NavbarDropdown() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session?.user ? (
          <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-primary">
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>{session.user.name}</AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="ghost">
            <Menu />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Home</DropdownMenuLabel>
        <DropdownMenuLabel>About us</DropdownMenuLabel>
        <DropdownMenuLabel>Contact</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session?.user ? (
          <>
            <DropdownMenuLabel>
              <Link href={"/"}>Profile</Link>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <Link href={"/"}>Dashboard</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuLabel asChild>
              <Button variant={"ghost"} onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </DropdownMenuLabel>
          </>
        ) : (
          <DropdownMenuLabel asChild>
            <SignupButton />
          </DropdownMenuLabel>
        )}
        <DropdownMenuLabel asChild> 
          <button
            className="flex items-center gap-2"
            aria-label={theme}
            onClick={() => {
              theme === "light" ? setTheme("dark") : setTheme("light");
            }}
          >
            {theme === "light" ? (
              <>
                <MoonIcon /> Enable Dark Mode
              </>
            ) : (
              <>
                <SunIcon /> Enable Light Mode
              </>
            )}
          </button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarDropdown;
