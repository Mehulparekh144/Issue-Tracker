import React, {  ReactNode } from 'react'
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bug, Users } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


function layout({children} : {children : ReactNode}) {
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-2xl font-display">Add</h1>
      <div className="flex flex-row gap-2 flex-wrap mt-4 ">
        <Link
          href={"/dashboard/add/team"}
          className={cn(
            buttonVariants({
              variant: "secondary",
            }),
            "flex gap-1 items-center"
          )}
        >
          <Users className="h-6 w-6 mr-2" />
          New Team
        </Link>
        <Link
          href={"/dashboard/add/issue"}
          className={cn(
            buttonVariants({
              variant: "secondary",
            }),
            "flex gap-1 items-center"
          )}
        >
          <Bug className="h-6 w-6 mr-2" />
          New Issue
        </Link>
      </div>
      <div className="w-full">{children}</div>
    </MaxWidthWrapper>
  );
}

export default layout