import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { db } from "@/db";
import bcrypt from 'bcrypt';

export const appRouter = router({
  //Routes
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
  ,
  getUsersWithNoTeam: privateProcedure.query(async () => {
    const dbUsers = await db.user.findMany();
    return dbUsers.filter((item) => item.teamId === null)
  })
  ,
  registerUser: publicProcedure.input(z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
  })).mutation(async ({ input }) => {
    const { name, email, password } = input
    const dbUser = await db.user.findUnique({
      where: {
        email: email
      }
    })
    const hashedPass = bcrypt.hashSync(password, 10);

    if (dbUser) {
      throw new TRPCError({ code: "CONFLICT" })
    }
    else {
      await db.user.create({
        data: {
          email: email,
          name: name,
          password: hashedPass
        }
      })
    }
    return { success: true }
  })

})

export type AppRouter = typeof appRouter;