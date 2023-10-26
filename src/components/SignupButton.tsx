"use  client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import AuthTab from "./auth/AuthTab";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignupButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const googleLoginHandler = async () => {
    const res = await signIn("google", {
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (res?.ok) {
      router.push("/dashboard");
      setIsOpen(false);
    }
    if (res?.status === 401) {
      toast.error("Invalid credentials");
    } else if (res?.error && res?.status != 401) {
      toast.error("Internal server error");
    }
  };
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
        <Button className="-ml-2 font-semibold" variant={"ghost"}>
          Sign in
        </Button>
      </DialogTrigger>

      <DialogContent>
        <AuthTab setIsOpen={setIsOpen} />
        <Separator />
        <Button
          variant={"secondary"}
          className="shadow-sm flex items-center text-zinc-600 dark:text-zinc-300 justify-center gap-4 mt-4 font-bold"
          onClick={googleLoginHandler}
        >
          <FcGoogle className="h-6 w-6" /> Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SignupButton;
