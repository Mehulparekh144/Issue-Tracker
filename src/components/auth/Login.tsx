"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import {
  LoginValidationSchema,
  loginValidationSchema,
} from "@/lib/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Login({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
  });

  const router = useRouter();

  const loginHandler: SubmitHandler<LoginValidationSchema> = async (data) => {
    const res = await signIn("credentials", {
      ...data,
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
    <>
      <form
        className="flex flex-col gap-2 justify-center items-center"
        onSubmit={handleSubmit(loginHandler)}
      >
        <div className="w-full">
          <Label>Email</Label>
          <Input
            className={`mt-1 ${errors.email && "outline-2 outline-red-600"}`}
            type="email"
            placeholder="jd@mail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive font-semibold mt-1 text-xs">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <Label>Password</Label>
          <Input
            className={`mt-1 ${errors.password && "outline-2 outline-red-600"}`}
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive font-semibold mt-1 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" variant={"default"} className="w-full my-4">
          Log in
        </Button>
      </form>
      <div className="flex flex-col gap-1">
        <h1 className="text-base">Test Credentials</h1>
        <p className="text-sm text-muted-foreground">
          test@workmail.com - Test@123
        </p>
        <p className="text-sm text-muted-foreground">
          testadmin@mail.com - TestAdmin@123
        </p>
      </div>
    </>
  );
}

export default Login;
