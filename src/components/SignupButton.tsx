"use  client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthTab from "./AuthTab";

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
        <Separator />
        <Button
          variant={"secondary"}
          className="flex items-center justify-center gap-4 mt-4 font-bold"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignupButton;
