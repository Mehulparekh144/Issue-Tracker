"use client";
import React from "react";
import { PageProps } from "../../../../../.next/types/app/layout";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, format } from "date-fns";
import UserToolTip from "@/components/dashboard/UserToolTip";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImagesModal from "@/components/dashboard/ImagesModal";

function IssuePage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const teamID = searchParams.get("teamId");
  const { issueid } = params;
  const { data, error, isLoading } = trpc.getIssueById.useQuery({
    issueId: issueid,
  });

  const priorityObject: { [key: string]: string } = {
    URGENT: "bg-red-500",
    HIGH: "bg-yellow-500",
    MEDIUM: "bg-blue-500",
    LOW: "bg-primary",
  };

  const statusObject: { [key: string]: string } = {
    OPEN: "bg-emerald-500",
    CLOSED: "bg-purple-600",
  };

  const {
    data: team,
    error: teamError,
    isLoading: isTeamLoading,
  } = trpc.getTeamById.useQuery({
    //@ts-ignore
    teamId: teamID,
  });

  if (!teamID || !issueid || error?.data?.code === "NOT_FOUND" || teamError) {
    router.push("/dashboard");
    toast.error("Resource not found");
  }

  return (
    <MaxWidthWrapper>
      {isLoading && isTeamLoading ? (
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-800 dark:text-zinc-200" />
          </div>
        </div>
      ) : (
        data && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex justify-between">
                <h1 className="font-display text-2xl md:text-3xl">
                  {data.issueTitle}
                </h1>
                <div className="flex gap-1 items-center justify-center">
                  <Badge
                    className={`${priorityObject[data.priority]} hover:bg-${
                      priorityObject[data.priority]
                    }`}
                  >
                    {data.priority}
                  </Badge>
                  <Badge
                    className={`${statusObject[data.status]} hover:bg-${
                      statusObject[data.status]
                    }`}
                  >
                    {data.status}
                  </Badge>
                </div>
              </div>
              <Separator className="my-2" />
              <blockquote className="text-xs md:text-sm italic text-zinc-600">
                Assigned by -{" "}
                <UserToolTip
                  name={data.assigner.name ?? ""}
                  email={data.assigner.email ?? ""}
                  image={data.assigner.image ?? ""}
                />
                &nbsp;
                {differenceInDays(new Date(data.assignedDate), new Date()) > 0
                  ? `${differenceInDays(
                      new Date(data.assignedDate),
                      new Date()
                    )} days ago`
                  : "today"}
              </blockquote>
              <h2 className="text-sm mt-4 md:text-base text-zinc-800 dark:text-zinc-300">
                {data.issueDescription}
              </h2>
              {data.Image.length > 0 && (
                <div className="grid relative grid-cols-3 h-max mt-6 grid-rows-2 rounded-md shadow-lg">
                  <div
                    className={
                      data.Image.length > 1
                        ? `col-span-2 row-span-2`
                        : `col-span-3 row-span-2`
                    }
                  >
                    <div className="w-full h-full">
                      <Image
                        src={data.Image[0].url}
                        alt={data.Image[0].name}
                        width={560}
                        height={560}
                        placeholder="blur"
                        blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        className="aspect-auto rounded-tl-md rounded-bl-md transition-opacity opacity-0 duration-[2s]"
                        onLoadingComplete={(image) =>
                          image.classList.remove("opacity-0")
                        }
                      />
                    </div>
                  </div>
                  {data.Image.length > 1 && (
                    <>
                      <div>
                        {data.Image[1] && (
                          <Image
                            src={data.Image[1].url}
                            alt={data.Image[1].name}
                            width={280}
                            height={280}
                            placeholder="blur"
                            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            className="aspect-auto rounded-tr-md transition-opacity opacity-0 duration-[2s]"
                            onLoadingComplete={(image) =>
                              image.classList.remove("opacity-0")
                            }
                          />
                        )}
                      </div>
                      <div>
                        {data.Image[2] && (
                          <Image
                            src={data.Image[2].url}
                            alt={data.Image[2].name}
                            width={280}
                            height={280}
                            placeholder="blur"
                            blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                            className="aspect-auto rounded-br-md transition-opacity opacity-0 duration-[2s]"
                            onLoadingComplete={(image) =>
                              image.classList.remove("opacity-0")
                            }
                          />
                        )}
                      </div>
                    </>
                  )}
                  <ImagesModal images={data.Image} />
                </div>
              )}
            </div>

            <div className="flex  md:mt-0 ml-0 md:ml-4 flex-row flex-wrap md:flex-col gap-4 md:gap-1  items-start justify-center md:items-start md:justify-between">
              <div>
                <h1 className="text-sm md:text-base text-center font-semibold">
                  Deadline Date{" "}
                  <Badge
                    variant={
                      differenceInDays(
                        new Date(data.deadlineDate),
                        new Date()
                      ) < 5
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    Due in{" "}
                    {differenceInDays(new Date(data.deadlineDate), new Date())}{" "}
                    Days
                  </Badge>
                </h1>
                <div className="shadow-md">
                  <Calendar
                    mode="single"
                    selected={new Date(data.deadlineDate)}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-sm mb-2 md:text-base text-center font-semibold">
                  {data.teamAssigned.name}
                </h1>
                <div className="flex flex-col gap-2 w-full items-start justify-center">
                  {team.users.map((user) => (
                    <div
                      className="flex  items-center justify-between w-full"
                      key={user.id}
                    >
                      <div className="flex gap-4 justify-between items-start">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image ?? ""} />
                          <AvatarFallback>
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                          <h1>{user.name}</h1>
                          <Link
                            href={`mailto:${user.email}`}
                            className="text-xs text-muted-foreground"
                          >
                            {user.email}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </MaxWidthWrapper>
  );
}

export default IssuePage;
