import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";

export const appRouter = router({
  //Routes
  authCallback : publicProcedure.query(async ()=>{
    const session = getServerSession();

    if(!session){
      throw new TRPCError({code : "UNAUTHORIZED"})
    }

    return {success : true}
  })
})

export type AppRouter = typeof appRouter;