"use client";
import { trpc } from "@/app/_trpc/client";
import React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RegisterValidationSchema, registerValidationSchema } from "@/lib/formValidation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Signup({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValidationSchema>({ resolver: zodResolver(registerValidationSchema) });

  const { mutate: registerMutate } = trpc.registerUser.useMutation({
    onSuccess(data) {
      setIsOpen(false);
      toast.success("User registered");
    },
    onError(error) {
      if (error.data?.code === "CONFLICT") {
        toast.error("User exists ! Try logging in.");
      } else {
        toast.error(error.message);
      }
    },
  });

  const registerHandler : SubmitHandler<RegisterValidationSchema> =(data) => {
    registerMutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };
  return (
    <form
      className="flex flex-col gap-2 justify-center items-center"
      onSubmit={handleSubmit(registerHandler)}
    >
      <div className="w-full">
        <Label>Name</Label>
        <Input
          className={`mt-1 ${errors.name && "outline-2 outline-red-600"}`}
          type="text"
          placeholder="Jane Doe"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive font-semibold mt-1 text-xs">
            {errors.name.message}
          </p>
        )}
      </div>
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
        Sign up
      </Button>
    </form>
  );
}

export default Signup;
