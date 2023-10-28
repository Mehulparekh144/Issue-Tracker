"use client"
import { trpc } from '@/app/_trpc/client'
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import React from 'react'

function page() {
  const {data , isLoading , error , isFetched} = trpc.getAllUsers.useQuery();
  const roleColor = {
    ADMIN : 'bg-red-500 hover:bg-red-500/90',
    USER : 'bg-primary'
  }

  const roleObject = {
    ADMIN : 0,
    USER : 1
  }
  if(isFetched){
    data?.sort((a,b)=>{
      const difference =  roleObject[a.role] - roleObject[b.role]
      return difference
    })
  }
  // To add table
  // Horizontal scrollbar
  // Pagination for 5 users per page
  
  return (
    <MaxWidthWrapper className="mt-10 max-w-screen flex flex-col space-y-3 items-start justify-center">
      <h1 className="text-xl md:text-2xl font-display">Manage Users</h1>
      <div className="w-full">
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
                        <TableCell className="py-4 w-20">
                          <Skeleton className="h-4 w-3" />
                        </TableCell>
                        <TableCell className="py-4 w-40">
                          <Skeleton className="h-4  w-full" />
                        </TableCell>
                        <TableCell className="py-4 w-60">
                          <Skeleton className="h-4  w-full" />
                        </TableCell>
                        <TableCell className="py-4 w-40">
                          <Skeleton className="h-6 w-14" />
                        </TableCell>
                        <TableCell className="py-4 text-center w-20">
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
                {data &&
                  data?.length > 0 &&
                  data.map((item, index) => (
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
                        <Button variant={"destructive"} size={"icon"}>
                          <Trash className="h-4 w-4" />
                        </Button>
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
    </MaxWidthWrapper>
  );
}

export default page