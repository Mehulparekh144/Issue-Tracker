
import React, {  ReactNode } from 'react'
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bug, Users } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import AddNavbar from '@/components/dashboard/AddNavbar';


function layout({children} : {children : ReactNode}) {
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-xl md:text-2xl font-display">Add</h1>
      <AddNavbar />
      <div className="w-full">{children}</div>
    </MaxWidthWrapper>
  );
}

export default layout