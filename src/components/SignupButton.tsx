import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { AiOutlineGoogle } from "@react-icons/all-files/ai/AiOutlineGoogle";

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
        <Button
          className="flex items-center justify-center gap-4 mt-4 font-bold"
          onClick={() => signIn("google")}
        >
          <AiOutlineGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignupButton;
