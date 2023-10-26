"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import IssueTable from "@/components/dashboard/IssueTable";
import { Suspense } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";
import dynamic from "next/dynamic";
function Dashboard() {

  const IssueTable = dynamic(() => import("@/components/dashboard/IssueTable"), {
    suspense : true
  });
  
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-2xl font-display">Dashboard</h1>
      <div className="w-full">
        <ScrollArea>
          <Suspense fallback={<div>Loading ....</div>}>
        <IssueTable />
          </Suspense>
        <ScrollBar orientation="horizontal"/> 
        </ScrollArea>
      </div>
    </MaxWidthWrapper>
  );
}

export default Dashboard;
