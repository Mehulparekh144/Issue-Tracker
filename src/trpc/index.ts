import { TRPCError } from "@trpc/server";
import { adminProcedure, privateProcedure, publicProcedure, router } from "./trpc";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { db } from "@/db";
import bcrypt from 'bcrypt';
import { userObjectSchema } from "@/lib/schemas/userSchema";
import { UTApi } from "uploadthing/server";
import { imageObjectSchema } from "@/lib/schemas/imagesSchema";



const utapi = new UTApi()


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

  getAllUsers: adminProcedure.query(async () => {
    try {
      const dbUsers = await db.user.findMany()
      return dbUsers
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  }),

  deleteUser: adminProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ input }) => {
    const { id } = input
    try {
      const dbUser = await db.user.findUnique({
        where: {
          id: id
        }
      })
      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      await db.user.delete({
        where: {
          id: id
        }
      })

      if (dbUser.teamId) {
        await db.team.update({
          data: {
            size: {
              decrement: 1
            }
          }
          ,
          where: {
            id: dbUser.teamId
          }
        })
      }
      return { status: true }
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  }),

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

  getTeamById: privateProcedure.input(z.object({ teamId: z.string() })).query(async ({ input }) => {
    try {
      const dbTeam = await db.team.findUnique({
        where: {
          id: input.teamId
        },
        include: {
          users: true
        }
      })
      if (!dbTeam) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return dbTeam
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

    }
  }),

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
  }),

  addTeamMember: adminProcedure.input(z.object({
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

      const userExists = dbTeam.users.some((user) => user.id === userId)
      if (userExists) {
        throw new TRPCError({ code: "CONFLICT" })
      }

      const dbUser = await db.user.findUnique({
        where: {
          id: userId
        }
      })

      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      dbTeam.users.push(dbUser)
      const updatedUsers = dbTeam.users


      await db.team.update({
        where: {
          id: teamId
        },
        data: {
          size: dbTeam.size + 1,
          users: {
            set: updatedUsers.map((user) => ({ id: user.id })),
          }
        }
      })

      return { success: true }

    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  }),

  getTempFile: adminProcedure.input(z.object({
    key: z.string(),
  })).mutation(async ({ input }) => {
    const { key } = input

    const file = await db.tempImage.findFirst({
      where: {
        key: key
      }
    })

    if (!file) {
      throw new TRPCError({ code: "NOT_FOUND" })
    }
    return file
  }),

  removeTempFile: adminProcedure.input(z.object({
    id: z.string(),
    key: z.string()
  })).mutation(async ({ input }) => {
    const { id, key } = input
    try {
      await utapi.deleteFiles(key)
      const dbFile = await db.tempImage.findUnique({
        where: {
          id: id
        }
      })
      if (!dbFile) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      await db.tempImage.delete({
        where: {
          id: id
        }
      })

      return id

    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })

    }
  })
  ,

  createNewIssue: adminProcedure.input(z.object({
    issueName: z.string(),
    issueDescription: z.string(),
    deadlineDate: z.string(),
    priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
    team: z.string(),
    selectedFiles: z.array(imageObjectSchema)
  })).mutation(async ({ ctx, input }) => {
    const { issueName, issueDescription, deadlineDate, priority, team, selectedFiles } = input;
    const { user } = ctx;

    try {
      const createdIssue = await db.issue.create({
        data: {
          issueTitle: issueName,
          issueDescription: issueDescription,
          teamAssignedId: team,
          assignerId: user.id,
          assignedDate: new Date(),
          deadlineDate: new Date(deadlineDate),
          priority: priority,
          status: "OPEN",
          Image: {
            create: selectedFiles.map(image => ({
              url: image.url,
              key: image.key,
              name: image.name,
            })),
          },
        },
      });

      return { status: true };
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  })
  ,

  getAllIssues: privateProcedure.query(async () => {
    try {
      const dbIssues = await db.issue.findMany({
        include: {
          Image: true,
          teamAssigned: true,
          assigner: true
        }
      })
      return dbIssues
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })
  ,

  getIssueById: privateProcedure.input(z.object({
    issueId: z.string()
  })).query(async ({ input }) => {
    try {
      const dbIssue = await db.issue.findUnique({
        where: {
          id: input.issueId
        },
        include: {
          assigner: true,
          teamAssigned: true,
          Image: true
        }
      })
      if (!dbIssue) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return dbIssue
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })
  ,

  changeIssuePriority: adminProcedure.input(z.object({
    issueId: z.string(),
    priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
  })).mutation(async ({ input }) => {
    const { issueId, priority } = input
    try {
      await db.issue.update({
        where: {
          id: issueId
        },
        data: {
          priority: priority
        }
      })

      return { status: true }
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })
  ,

  changeIssueStatus: adminProcedure.input(z.object({
    issueId: z.string(),
    status: z.enum(["OPEN", "CLOSED"]),
  })).mutation(async ({ input }) => {
    const { issueId, status } = input
    try {
      await db.issue.update({
        where: {
          id: issueId
        },
        data: {
          status: status
        }
      })

      return { status: true }
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })
  ,

  getUserInfo: privateProcedure.input(z.object({
    id: z.string()
  })).query(async ({ input }) => {
    const { id } = input
    try {
      const dbUser = await db.user.findUnique({
        where: {
          id: id
        },
        include: {
          team: true,
          issues: true
        }
      })
      if (!dbUser) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return dbUser
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
    }
  })


})

export type AppRouter = typeof appRouter;