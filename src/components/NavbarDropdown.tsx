import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Menu } from "lucide-react";
import { Switch } from "./ui/switch";
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
          <DropdownMenuLabel asChild>
            <Button variant={"ghost"} onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </DropdownMenuLabel>
        ) : (
          <>
            <DropdownMenuLabel>
              <Link href="/">
                Get Started &rarr;
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuLabel asChild>
              <SignupButton />
            </DropdownMenuLabel>
          </>
        )}
        <DropdownMenuLabel>
          <Switch
            value={theme}
            onClick={() => {
              theme === "light" ? setTheme("dark") : setTheme("light");
            }}
          />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarDropdown;
