"use client";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import DeleteTeamButton from "@/components/dashboard/DeleteTeamButton";
import TeamDetails from "@/components/dashboard/TeamDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ghost, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function Teams() {
  const { data: teams, isLoading, error } = trpc.getTeams.useQuery();
  const { data } = useSession();
  console.log(teams);
  if (error) {
    toast.error("Error loading teams");
  }
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-xl md:text-2xl font-display">Teams</h1>
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-1  lg:grid-cols-3 md:grid-cols-2 gap-4 w-full ">
          {teams.map((item) => (
            <div
              key={item.id}
              className="w-full dark:bg-zinc-800 bg-zinc-200 p-4 rounded-lg"
            >
              <h1 className="text-base md:text-lg font-semibold mb-1">
                {item.name}
              </h1>
              <h1 className="text-sm md:text-base">Team size - {item.size}</h1>
              <div className="flex mt-1">
                {item.users.map((user) => (
                  <div key={user.id}>
                    <Avatar className="h-8 w-8 ring-2 ring-primary">
                      <AvatarImage src={user.image ?? ""} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3 w-full">
                <TeamDetails team={item}/>
                {data?.user.role === "ADMIN" && (
                  <DeleteTeamButton name={item.name} teamId={item.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1  lg:grid-cols-3 md:grid-cols-2 gap-4 w-full ">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex w-full flex-col space-y-2 mt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex text-primary w-full flex-col items-center pt-24 justify-center">
            <Ghost className="h-12 w-12"/>

          <h1 className="text-muted-foreground mt-2 ">No Teams here</h1>
          <Link className="text-sm" href="/dashboard/add/team">Click to create one</Link>
        </div>
      )}
    </MaxWidthWrapper>
  );
}

export default Teams;
