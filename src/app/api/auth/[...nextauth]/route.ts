import NextAuth from 'next-auth/next'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  adapter: PrismaAdapter(prisma)
})

export { handler as GET, handler as POST };