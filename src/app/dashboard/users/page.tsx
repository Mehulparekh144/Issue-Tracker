"use client";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import DeleteUser from "@/components/dashboard/DeleteUser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoveLeft, MoveRight, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

function ManageUsers() {
  const { data, isLoading, error, isFetched } = trpc.getAllUsers.useQuery();
  const session = useSession();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  let maxPages = 0;
  

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const roleColor = {
    ADMIN: "bg-red-500 hover:bg-red-500/90",
    USER: "bg-primary",
  };

  const roleObject = {
    ADMIN: 0,
    USER: 1,
  };
  const currentData = data ? data.slice(firstIndex, lastIndex) : [];
  if(data && data.length > 0){
    maxPages = Math.ceil(data.length / rowsPerPage)
  }
  if (isFetched) {
    currentData?.sort((a, b) => {
      const difference = roleObject[a.role] - roleObject[b.role];
      return difference;
    });
  }

  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-xl md:text-2xl font-display">Manage Users</h1>
      <div className="w-full h-[300px]">
        <ScrollArea>
          <Table className="w-full">
            {isLoading ? (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">No.</TableHead>
                    <TableHead className="w-40">Name</TableHead>
                    <TableHead className="w-60">Email</TableHead>
                    <TableHead className="w-40">Role</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {isLoading && (
                        <>
                          <TableCell className="py-3 w-20">
                            <Skeleton className="h-4 w-3" />
                          </TableCell>
                          <TableCell className="py-3 w-40">
                            <Skeleton className="h-4  w-full" />
                          </TableCell>
                          <TableCell className="py-3 w-60">
                            <Skeleton className="h-4  w-full" />
                          </TableCell>
                          <TableCell className="py-3 w-40">
                            <Skeleton className="h-6 w-14" />
                          </TableCell>
                          <TableCell className="py-3 text-center w-20">
                            <Skeleton className="h-8 w-8" />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">No.</TableHead>
                    <TableHead className="w-40">Name</TableHead>
                    <TableHead className="w-60">Email</TableHead>
                    <TableHead className="w-40">Role</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData &&
                    currentData?.length > 0 &&
                    currentData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="w-20">{index + 1}</TableCell>
                        <TableCell className="w-40">{item.name}</TableCell>
                        <TableCell className="w-60">{item.email}</TableCell>
                        <TableCell className="w-40">
                          <Badge className={`${roleColor[item.role]}`}>
                            {item.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-20">
                          <DeleteUser
                            userId={item.id}
                            name={item.name ?? ""}
                            adminId={session.data?.user.id}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </>
            )}
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex justify-between items-center gap-2 w-full pt-6">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          size={"icon"}
          aria-label="Back"
          disabled={currentPage <= 1 || isLoading}
        >
          <MoveLeft className="h-4 w-4" />
        </Button>
        <div>
          {Array.from({ length: maxPages }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index + 1 ? "default" : "ghost"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          size={"icon"}
          aria-label="Next"
          disabled={currentPage === maxPages || data?.length === rowsPerPage || isLoading}
        >
          <MoveRight className="h-4 w-4" />
        </Button>
      </div>
    </MaxWidthWrapper>
  );
}

export default ManageUsers;
