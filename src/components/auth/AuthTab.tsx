"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Login from "./Login";
import Signup from "./Signup";
import z from "zod";

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
  const [data, setData] = useState<DataProps>({
    name: "",
    email: "",
    password: "",
  });




  return (
    <Tabs defaultValue="login">
      <TabsList>
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="register">
        <Signup setIsOpen={setIsOpen}/>
      </TabsContent>
    </Tabs>
  );
}

export default AuthTab;
