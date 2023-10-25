import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserProps{
  name : string,
  email : string,
  image : string
}

function UserToolTip({name , email , image} : UserProps ) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline cursor-pointer">{name}</span>
        </TooltipTrigger>
        <TooltipContent asChild>
          <div className="dark:bg-zinc-800 bg-zinc-100   flex items-center justify-center gap-4 not-italic">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image} />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-sm text-zinc-800 dark:text-zinc-100">{name}</h1>
              <h1 className="text-xs text-zinc-400 dark:text-zinc-600">
                {email}
              </h1>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default UserToolTip;
