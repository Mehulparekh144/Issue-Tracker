import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";

export const appRouter = router({
  //Routes
  test: publicProcedure.query(() => {
    return { success: true }
  }),
  authCallback: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);


    if (!session) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const dbUser = await db.user.findFirst({
      where: {
        email: session.user?.email
      }
    })

    if (!dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return { success: true }
  })
})

export type AppRouter = typeof appRouter;