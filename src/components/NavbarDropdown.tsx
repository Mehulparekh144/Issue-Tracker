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
import type { Session } from "next-auth";

function NavbarDropdown({ session }: { session: Session | null }) {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session?.user ? (
          <Avatar className="cursor-pointer h-8 w-8 ring-2 ring-primary">
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>
              {session.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="ghost">
            <Menu />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <Link href={"/home"}>Home</Link>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <Link href={"/about"}>About us</Link>
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          <Link href={"/contact"}>Contact</Link>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session?.user ? (
          <>
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
          </>
        ) : (
          <DropdownMenuLabel>
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
