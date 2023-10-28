"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRole } from "@prisma/client";
import { Loader2, Mail, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import UserSelectItem from "./UserSelectItem";

interface UserProps {
  image: string | null;
  name: string | null;
  id: string;
  role: UserRole;
  email: string | null;
  password: string | null;
  emailVerified: string | null;
  teamId: string | null;
}

interface IssueProps {
  id: string;
  issueTitle: string;
}

interface TeamProps {
  id: string;
  name: string;
  size: number;
  users: Array<UserProps>;
  issues: Array<IssueProps>;
}

function TeamDetails({ team }: { team: TeamProps }) {
  const { data } = useSession();
  const utils = trpc.useContext();
  const [indUser, setIndUser] = useState<string | null>("");
  const { data: users, isLoading } = trpc.getUsersWithNoTeam.useQuery();
  const [deleting, setDeleting] = useState<string | null>("");
  const [adding, setAdding] = useState<string | null>("");
  const { mutate: removeTeamMemberMutate } = trpc.deleteTeamMember.useMutation({
    onSuccess(data) {
      utils.getTeams.invalidate();
      utils.getUsersWithNoTeam.invalidate();
    },
    onMutate({ userId }) {
      setDeleting(userId);
    },
    onSettled() {
      setDeleting(null);
    },
    onError(error) {
      if (error.data?.code === "METHOD_NOT_SUPPORTED") {
        toast.error("Team must have one member");
      } else {
        toast.error(error.message);
      }
    },
  });

  const { mutate: addTeamMemberMutate } = trpc.addTeamMember.useMutation({
    onSuccess(data) {
      utils.getTeams.invalidate();
      utils.getUsersWithNoTeam.invalidate();
    },
    onMutate({ userId }) {
      setAdding(userId);
    },
    onSettled() {
      setAdding(null);
      setIndUser(null);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const removeTeamMemberHandler = (teamId: string, userId: string) => {
    removeTeamMemberMutate({
      teamId: teamId,
      userId: userId,
    });
  };

  const addTeamMemberHandler = (teamId: string, userId: string) => {
    addTeamMemberMutate({
      teamId: teamId,
      userId: userId,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full text-sm">View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col w-full gap-2">
          <h1 className="font-semibold">Team Members</h1>
          {team.users.map((user) => (
            <div
              className="flex  items-center justify-between w-full"
              key={user.id}
            >
              <div className="flex gap-4 justify-between items-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
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
              {data?.user.role === "ADMIN" && (
                <div>
                  <Button
                    onClick={() => removeTeamMemberHandler(team.id, user.id)}
                    variant={"destructive"}
                    size={"icon"}
                    disabled={deleting === user.id || team.size === 1}
                  >
                    {deleting === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Minus />
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        {data?.user.role === "ADMIN" && (
          <div className="flex items-end gap-3">
            <Select onValueChange={(value) => setIndUser(value)}>
              <SelectTrigger
                className="mt-2 flex gap-2"
                disabled={isLoading || users?.length === 0}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <SelectValue
                  placeholder={
                    users?.length === 0 ? "No members to add" : "Add members"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users?.map((user) => (
                    <>
                      <SelectItem key={user.id} value={user.id}>
                        <UserSelectItem
                          email={user.email ?? ""}
                          name={user.name ?? ""}
                          image={user.image ?? ""}
                        />
                      </SelectItem>
                    </>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {indUser && (
              <Button
                size={"icon"}
                onClick={() => addTeamMemberHandler(team.id, indUser)}
                disabled={adding === indUser }
              >
                {adding === indUser ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        )}

        <Separator />
        <div className="flex flex-col w-full gap-2">
          <h1 className="font-semibold">Issues Assigned</h1>
          {team.issues.length > 0 ? (
            team.issues.map((issue) => (
              <Link
                key={issue.id}
                href={"/dashboard/issue/" + issue.id + "?teamId=" + team.id }
                className="text-sm underline"
              >
                {issue.issueTitle}
              </Link>
            ))
          ) : (
            <h1 className="text-muted-foreground text-xs">
              No issues assigned
            </h1>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TeamDetails;
