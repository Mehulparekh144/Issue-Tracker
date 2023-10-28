import React, { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";


function DeleteUser({userId , name} : {userId : string , name : string}) {
  const [deleting , setDeleting] = useState<string|null>("");
  const utils = trpc.useContext();
  const [isOpen , setIsOpen] = useState<boolean>(false) ;
  const {mutate : deleteUserMutate} = trpc.deleteUser.useMutation({
    onMutate({id}){
      setDeleting(id)
    }
    ,
    onSettled(){
      setDeleting(null)
      utils.getAllUsers.invalidate()
      toast.success("User deleted Successfully");
      setIsOpen(false)
    }
    ,
    onError(error){
      if(error.data?.code === 'NOT_FOUND'){
        toast.error("User doesn't exists")
      }
      else{
        toast.error("Internal Server Error")
      }
    }
  });

  const deleteUserHandler = (userId : string) =>{
    deleteUserMutate({
      id : userId
    })
  }

  return (
    <AlertDialog 
    open = {isOpen}
    onOpenChange={(v)=>{
      if(!v){
        setIsOpen(v)
      }
    }}>
      <AlertDialogTrigger asChild>
        <Button onClick={()=>setIsOpen(true)} variant={"destructive"} size={"icon"}>
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <>
            <p className="text-bold text-red-500">You are deleting {name}&apos;s account </p>
            This action cannot be undone. This will permanently delete the team
            and remove it from the database.
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteUserHandler(userId)
            }}
            disabled={deleting === userId}
          >
            {deleting === userId ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUser;
