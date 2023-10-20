import { TRPCError } from "@trpc/server";
import { adminProcedure, privateProcedure, publicProcedure, router } from "./trpc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { db } from "@/db";
import bcrypt from 'bcrypt';
import { userObjectSchema } from "@/lib/userSchema";



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
  getUsersWithNoTeam: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx
    const dbUsers = await db.user.findMany();
    return dbUsers.filter((item) => item.teamId === null && item.email != user.email)
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
  ,

  createNewTeam: adminProcedure.input(z.object({
    teamName: z.string(),
    selectedUsers: z.array(userObjectSchema)
  })).mutation(async ({ input, ctx }) => {
    const { teamName, selectedUsers } = input
    const teams = await db.team.findFirst({
      where: {
        name: teamName
      }
    })

    if (teams) {
      throw new TRPCError({ code: "CONFLICT" })
    }
    const newTeam = await db.team.create({
      data: {
        name: teamName,
        size: selectedUsers.length,
        users: {
          connect: selectedUsers.map((user) => ({ id: user.id }))
        }
      }
    })
    return newTeam
  })
  ,

  getTeams: privateProcedure.query(async () => {
    const dbTeams = await db.team.findMany(
      {
        include: {
          users: true,
          issues: true
        }
      }
    );
    return dbTeams
  })
  ,

  deleteTeam: adminProcedure.input(z.object({
    teamId: z.string()
  })).mutation(async ({ input }) => {
    const { teamId } = input
    try {
      const dbTeam = await db.team.findFirst({
        where: {
          id: teamId
        }
      })
      if (!dbTeam) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      else {
        await db.team.delete({
          where: {
            id: teamId
          }
        })
        return { success: true }
      }
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })
  ,
  deleteTeamMember: adminProcedure.input(z.object({
    userId: z.string(),
    teamId: z.string()
  })).mutation(async ({ input }) => {
    const { userId, teamId } = input
    try {
      const dbTeam = await db.team.findUnique({
        where: {
          id: teamId
        },
        include: {
          users: true
        }
      })
      if (!dbTeam) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      if (dbTeam.size <= 1) {
        throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" })
      }

      const userExists = dbTeam.users.some((user) => user.id === userId)
      if (!userExists) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      const updatedUsers = dbTeam.users.filter((user) => user.id != userId)

      await db.team.update({
        where: {
          id: teamId
        },
        data: {
          size: dbTeam.size - 1,
          users: {
            set: updatedUsers.map((user) => ({ id: user.id })),
          }
        }
      })

      return { success: true }

    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })

})

export type AppRouter = typeof appRouter;