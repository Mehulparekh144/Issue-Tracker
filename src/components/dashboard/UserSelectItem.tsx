import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface userItem{
  name : string,
  image : string,
  email : string
}

function UserSelectItem({name , image , email} : userItem) {
  return (
    <div className="flex gap-1 items-center w-full">
      <Avatar className="cursor-pointer h-8 w-8">
        <AvatarImage src={image ?? ""} />
        <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-sm">{name}</h1>
        <h1 className="text-muted-foreground text-xs">{email}</h1>
      </div>
    </div>
  );
}

export default UserSelectItem;
