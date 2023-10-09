"use client";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import NavbarDropdown from "./NavbarDropdown";
import SignupButton from "./SignupButton";
import { useSession } from "next-auth/react";
import UserDropDown from "./UserDropDown";

function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  return (
    <nav className="min-h-10 sticky inset-0 dark z-30 backdrop-blur-md shadow-sm transition-all ">
      <MaxWidthWrapper className="flex flex-row items-center justify-between gap-4 py-2 ">
        <div>
          <h1 className="text-lg font-semibold font-display">ProTrackr.</h1>
        </div>
        <div className="hidden font-medium lg:flex flex-row items-center justify-center gap-12 text-sm">
          <Link href={"/"}>Home</Link>
          <Link href={"/"}>About Us</Link>
          <Link href={"/"}>Contact Us</Link>
        </div>
        <div className="hidden lg:flex flex-row items-center gap-3 ">
          {session && session.user ? (
            <UserDropDown image={session.user.image??""} name={session.user.name??""} />
          ) : (
            <>
              <SignupButton />
              <Link
                href={"/"}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                  }),
                  "font-medium"
                )}
              >
                Get Started &rarr;
              </Link>
            </>
          )}

          <Switch
            value={theme}
            onClick={() => {
              theme === "light" ? setTheme("dark") : setTheme("light");
            }}
          />
        </div>

        <div className="lg:hidden">
          <NavbarDropdown />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
