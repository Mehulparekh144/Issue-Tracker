"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserSelectItem from "@/components/dashboard/UserSelectItem";

function page() {
  const { data: users, isLoading, error } = trpc.getUsersWithNoTeam.useQuery();
  if (error) {
    toast.error("Error loading the users. Try again later");
  }

  return (
    <div className="mt-4 mx-auto">
      <Separator className="mb-2" />
      <h1
        className="text-lg font-mediumpnpm dlx shadcn-ui@latest add label
"
      >
        New Team
      </h1>
      <form className="mt-4 flex flex-col flex-wrap gap-2">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            className="mt-2"
            id="teamName"
            placeholder="Enter your team name"
          />
        </div>
        <div>
          <Label htmlFor="teamUsers">Add Users</Label>
          <Select>
            <SelectTrigger
              disabled={isLoading}
              className="mt-2 flex gap-2"
              id="teamUsers"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
              <SelectValue placeholder="Users" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <UserSelectItem
                    email={item.email??""}
                    name={item.name??""}
                    image={item.image??""}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-max mt-2 font-semibold">Create</Button>
      </form>
    </div>
  );
}

export default page;
