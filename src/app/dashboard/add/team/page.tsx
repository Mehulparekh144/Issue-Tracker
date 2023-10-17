"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
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
import { Loader2, Minus, Plus } from "lucide-react";
import UserSelectItem from "@/components/dashboard/UserSelectItem";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  NewTeamValidationSchema,
  newTeamValidationSchema,
} from "@/lib/addTeamValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { UserObjectSchema } from "@/lib/userSchema";

function AddTeamPage() {
  const { data: users, isLoading, error } = trpc.getUsersWithNoTeam.useQuery();
  const [selectedUsers, setSelectedUsers] = useState<Array<UserObjectSchema>>(
    []
  );
  const [indUser, setIndUser] = useState<string | null>(null);

  if (error) {
    toast.error("Error loading the users. Try again later");
  }

  const { mutate: createNewTeamMutate } = trpc.createNewTeam.useMutation({
    onSuccess(data) {
      toast.success("Team created");
    },
    onError(error) {
      if (error.data?.code === "CONFLICT") {
        toast.error("Team name already exists !");
      } else {
        toast.error(error.message);
      }
    },
  });

  const addUserHandler = (item: string) => {
    const JSONItem = JSON.parse(item);
    setSelectedUsers([...selectedUsers, JSONItem]);
    setIndUser(null);
  };

  const removeUserHandler = (item: UserObjectSchema) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id != item.id));
    setIndUser(JSON.stringify(item));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTeamValidationSchema>({
    resolver: zodResolver(newTeamValidationSchema),
  });

  const createNewTeamHandler: SubmitHandler<NewTeamValidationSchema> = (
    data
  ) => {
    const { teamName } = data;
    createNewTeamMutate({
      teamName: teamName,
      selectedUsers: selectedUsers,
    });
  };

  return (
    <div className="mt-4 mx-auto">
      <Separator className="mb-2" />
      <h1 className="text-lg font-medium ">New Team</h1>
      <form
        className="mt-4 flex flex-col flex-wrap gap-2"
        onSubmit={handleSubmit(createNewTeamHandler)}
      >
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            className="mt-2"
            id="teamName"
            placeholder="Enter your team name"
            {...register("teamName")}
          />
          {errors.teamName && (
            <p className="text-destructive font-semibold mt-1 text-xs">
              {errors.teamName.message}
            </p>
          )}
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Label htmlFor="teamUsers">Add Users</Label>

            <Select onValueChange={(value) => setIndUser(value)}>
              <SelectTrigger
                disabled={isLoading}
                className="mt-2 flex gap-2"
                id="teamUsers"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <SelectValue placeholder="Users" />
              </SelectTrigger>
              <SelectContent>
                {users &&
                  users.map((item) => {
                    if (!selectedUsers.some((user) => user.id === item.id)) {
                      return (
                        <>
                          <SelectItem
                            key={item.id}
                            value={JSON.stringify(item)}
                          >
                            <UserSelectItem
                              email={item.email ?? ""}
                              name={item.name ?? ""}
                              image={item.image ?? ""}
                            />
                          </SelectItem>
                        </>
                      );
                    }
                  })}
              </SelectContent>
            </Select>
          </div>
          {indUser && (
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => addUserHandler(indUser)}
            >
              <Plus />
            </Button>
          )}
        </div>
        {selectedUsers.length === 0 && (
          <p className="text-destructive font-semibold mt-1 text-xs">
            Select atleast 1 user
          </p>
        )}

        {selectedUsers && (
          <div className="flex flex-col gap-4 w-full">
            {selectedUsers.map((item) => (
              <div className="flex w-full justify-between" key={item.id}>
                <UserSelectItem
                  email={item.email ?? ""}
                  name={item.name ?? ""}
                  image={item.image ?? ""}
                />
                <Button
                  variant={"ghost"}
                  onClick={() => removeUserHandler(item)}
                  size={"sm"}
                  type="button"
                >
                  <Minus />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button
          type="submit"
          disabled={selectedUsers.length === 0}
          className="w-max mt-2 font-semibold"
        >
          Create
        </Button>
      </form>
    </div>
  );
}

export default AddTeamPage;
