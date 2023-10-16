"use  client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import AuthTab from "./auth/AuthTab";
import { Separator } from "./ui/separator";

function SignupButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v: boolean) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant={"ghost"}>Sign in</Button>
      </DialogTrigger>

      <DialogContent>
        <AuthTab setIsOpen={setIsOpen} />
        <Separator/>
        <Button
          variant={"secondary"}
          className="shadow-sm flex items-center text-zinc-600 dark:text-zinc-300 justify-center gap-4 mt-4 font-bold"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <FcGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignupButton;
