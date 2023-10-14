"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { LoginValidationSchema, loginValidationSchema } from "@/lib/formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchema>({
    resolver: zodResolver(loginValidationSchema),
  });

  const loginHandler: SubmitHandler<LoginValidationSchema> = (data) => {
    signIn("credentials", {
      ...data,
      callbackUrl : "/dashboard"
    });
  };
  return (
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
  );
}

export default Login;
