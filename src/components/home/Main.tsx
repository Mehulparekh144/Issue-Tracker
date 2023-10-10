import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

function Main() {
  return (
    <div className="bg-transparent flex flex-col items-center gap-6 justify-start mt-28 h-screen">
      <div className="bg-zinc-100 dark:bg-zinc-900 dark:ring-zinc-700 text-sm font-medium shadow-md dark:gray rounded-full ring-1 ring-zinc-200 px-8 py-1">
        New way to manage your issues
      </div>
      <div className="flex flex-col justify-center text-center items-center gap-2">
        <h1 className="text-4xl md:text-5xl font-display ">
          Streamline your projects with{" "}
          <span className="text-primary font-bold">Protrackr</span>
        </h1>
        <h1 className="text-xl md:text-2xl">
          Effortless Issue Tracking and Project Management for Teams of All
          Sizes
        </h1>
      </div>
      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: "default",
          }),
          "font-semi-bold"
        )}
      >
        Get Started &rarr;
      </Link>
    </div>
  );
}

export default Main;
