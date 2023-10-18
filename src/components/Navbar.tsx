"use client";
import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useTheme } from "next-themes";
import NavbarDropdown from "./NavbarDropdown";
import SignupButton from "./SignupButton";
import UserDropDown from "./UserDropDown";
import { Switch } from "./ui/switch";
import type { Session } from "next-auth";
function Navbar({session} : {session:Session | null}) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky inset-0  z-30 backdrop-blur-md shadow-sm dark:shadow-xl transition-all ">
      <MaxWidthWrapper className="flex flex-row items-center justify-between gap-4 py-2 px-6 ">
        <div>
          <h1 className="text-lg font-semibold font-display">
            <Link href={"/"}>ProTrackr.</Link>
          </h1>
        </div>
        <div className="hidden font-medium lg:flex flex-row items-center justify-center gap-12 text-sm">
          <Link href={"/"}>Home</Link>
          <Link href={"/about"}>About Us</Link>
          <Link href={"/contact"}>Contact Us</Link>
        </div>
        <div className="hidden lg:flex flex-row items-center gap-4 ">
          {session && session.user ? (
            <UserDropDown
              image={session.user.image ?? ""}
              name={session.user.name ?? ""}
            />
          ) : (
            <>
              <SignupButton />
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
          <NavbarDropdown session={session} />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
