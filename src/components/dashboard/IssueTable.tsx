import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "../ui/skeleton";
import { differenceInDays, format } from "date-fns";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IssueData {
  issueNo: number;
  issueTitle: string;
  teamAssigned: string;
  assigner: string;
  assignedDate: string;
  deadlineDate: string;
  priority: string;
  status: string;
}

function IssueTable() {
  const router = useRouter();
  const { data, error, isLoading, isFetched } = trpc.getAllIssues.useQuery();
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

  const priorityComparisonObject = {
    URGENT: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  const statusComparisionObject = {
    OPEN: 0,
    CLOSED: 1,
  };

  const redirectToIssuePage = (issueId: string, teamId: string) => {
    router.push(`/dashboard/issue/${issueId}?teamId=${teamId}`);
  };

  if (isFetched) {
    data?.sort((a, b) => {
      const daysDifference =
        differenceInDays(new Date(a.deadlineDate), new Date()) -
        differenceInDays(new Date(b.deadlineDate), new Date());

      const priorityComparision =
        priorityComparisonObject[a.priority] -
        priorityComparisonObject[b.priority];

      const statusComparision =
        statusComparisionObject[a.status] - statusComparisionObject[b.status];

      if (daysDifference === 0) {
        return statusComparision || priorityComparision;
      }

      return statusComparision || daysDifference || priorityComparision;
    });
  }

  return (
    <>
      <Table className="max-w-screen ">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] ">Issue No.</TableHead>
            <TableHead className=" text-ellipsis overflow-hidden max-w-10">
              Issue Title
            </TableHead>
            <TableHead>Team Assigned</TableHead>
            <TableHead>Assigner</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead>Deadline Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4  w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 mt-1 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : data &&
              data?.length > 0 &&
              data.map((item, index) => (
                <TableRow
                  onClick={() =>
                    redirectToIssuePage(item.id, item.teamAssignedId)
                  }
                  key={item.id}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.issueTitle}</TableCell>
                  <TableCell>{item.teamAssigned.name}</TableCell>
                  <TableCell>{item.assigner.name}</TableCell>
                  <TableCell>
                    {format(new Date(item.assignedDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="flex flex-col gap-1 items-start justify-center">
                    {format(new Date(item.deadlineDate), "dd/MM/yyyy")}
                    <Badge
                      variant={
                        differenceInDays(
                          new Date(item.deadlineDate),
                          new Date()
                        ) < 5
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      Due in{" "}
                      {differenceInDays(
                        new Date(item.deadlineDate),
                        new Date()
                      )}{" "}
                      Days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusObject[item.status]} hover:bg-${
                        statusObject[item.status]
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={`${priorityObject[item.priority]} hover:bg-${
                        priorityObject[item.priority]
                      }`}
                    >
                      {item.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
}

export default IssueTable;
