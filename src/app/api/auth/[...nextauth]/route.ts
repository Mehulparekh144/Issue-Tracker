import NextAuth from 'next-auth/next'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    error: '/',
    signIn: '/dashboard',
    signOut : '/'
  },
  adapter: PrismaAdapter(prisma)
}

const AuthHandler = NextAuth(authOptions,)

export { AuthHandler as GET, AuthHandler as POST };