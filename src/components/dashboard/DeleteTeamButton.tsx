"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";

interface TeamProps {
  name: string;
  teamId: string;
}

function DeleteTeamButton({ name, teamId }: TeamProps) {
  const utils = trpc.useContext();
  const [deleting, setDeleting] = useState<string | null>("");
  const { mutate: deleteTeamMutate } = trpc.deleteTeam.useMutation({
    onSuccess(data) {
      utils.getTeams.invalidate();
      toast.success(`${name} deleted successfully`);
    },
    onMutate({ teamId }) {
      setDeleting(teamId);
    },
    onSettled() {
      setDeleting(null);
    },
    onError(error) {
      if (error.data?.code === "NOT_FOUND") {
        toast.error("Team doesn't exists");
      } else {
        toast.error(error.message);
      }
    },
  });

  const deleteTeamHandler = (teamId: string) => {
    deleteTeamMutate({
      teamId: teamId,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full text-sm" variant={"destructive"}>
          <Trash className="h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the team
            and remove it from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteTeamHandler(teamId);
            }}
            disabled = {deleting === teamId}
          >
            {
              deleting === teamId ? 
              <Loader2 className="h-4 w-4 animate-spin"/> 
            :
            "Delete"
          }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTeamButton;
