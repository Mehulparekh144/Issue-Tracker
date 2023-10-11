"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import IssueTable from "@/components/dashboard/IssueTable";
import React from "react";

function Dashboard() {
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-2xl font-display">Dashboard</h1>
      <div className="lg:w-full w-screen ">
      <IssueTable/>
      </div>
    </MaxWidthWrapper>
  );
}

export default Dashboard;
