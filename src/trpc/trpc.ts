import {TRPCError , initTRPC} from '@trpc/server'

const t = initTRPC.create();
const middleWare = t.middleware

export const router = t.router
export const publicProcedure = t.procedure;
