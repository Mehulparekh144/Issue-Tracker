import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserRole } from "@prisma/client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UserProps {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null;
  role: UserRole;
}

function ProfileUserContent({ name, email, id, image, role }: UserProps) {
  return (
    <div className="flex gap-8 flex-col  md:flex-row justify-center items-center md:items-start">
      <div className="relative w-max">
        <Avatar className=" h-32 w-32 md:h-56 md:w-56 ">
          <AvatarImage src={image ?? ""} />
          <AvatarFallback className="text-5xl md:text-8xl">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full flex flex-col gap-2 mt-2 ">
        <div>
          <Label className="text-lg">Name</Label>
          <Input disabled={true} className="mt-1" value={name ?? ""} />
        </div>
        <div>
          <Label className="text-lg">Email</Label>
          <Input disabled={true} className="mt-1" value={email ?? ""} />
        </div>
        <div>
          <Label className="text-lg">Role</Label>
          <Input disabled={true} className="mt-1" value={role ?? ""} />
        </div>
      </div>
    </div>
  );
}

export default ProfileUserContent;
