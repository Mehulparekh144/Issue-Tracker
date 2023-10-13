"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface DataProps {
  name: string;
  email: string;
  password: string;
}

function AuthTab({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [data, setData] = useState<DataProps>({
    name: "",
    email: "",
    password: "",
  });

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


  const registerHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };
  const loginHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials" ,{
      ...data,
      redirect : true
    })
  };

  return (
    <Tabs defaultValue="login">
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form
          className="flex flex-col gap-2 justify-center items-center"
          onSubmit={loginHandler}
        >
          <div className="w-full">
            <Label>Email</Label>
            <Input
              value={data.email}
              className="mt-1"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
              placeholder="jd@mail.com"
              required
            />
          </div>
          <div className="w-full">
            <Label>Password</Label>
            <Input
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="mt-1"
              type="password"
              required
            />
          </div>
          <Button variant={"default"} className="w-full my-4">
            Log in
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="register">
        <form
          className="flex flex-col gap-2 justify-center items-center"
          onSubmit={registerHandler}
        >
          <div className="w-full">
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="mt-1"
              type="text"
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="w-full">
            <Label>Email</Label>
            <Input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="mt-1"
              type="email"
              placeholder="jd@mail.com"
              required
            />
          </div>
          <div className="w-full">
            <Label>Password</Label>
            <Input
              onChange={(e) => setData({ ...data, password: e.target.value })}
              value={data.password}
              className="mt-1"
              type="password"
              required
            />
          </div>
          <Button variant={"default"} className="w-full my-4">
            Sign up
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default AuthTab;
