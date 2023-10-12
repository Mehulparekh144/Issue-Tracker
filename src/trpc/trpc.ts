import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TRPCError, initTRPC } from '@trpc/server'
import { getServerSession } from 'next-auth';

const t = initTRPC.create();
const middleWare = t.middleware

const isAuth = middleWare(async (opts) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  if (!session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx: {
      user: session.user,
    }
  })
})

export const router = t.router
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)
