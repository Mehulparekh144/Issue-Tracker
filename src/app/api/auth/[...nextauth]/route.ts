import NextAuth from 'next-auth/next'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/db'
import bcrypt from 'bcrypt'
import { NextAuthOptions } from 'next-auth'

const prisma = new PrismaClient()
export const authOptions : NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      credentials: {
        name: { label: "username", type: "text", placeholder: "John Doe" },
        email: { label: "useremail", type: "text", placeholder: "jd@mail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }
        const dbUser = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!dbUser) {
          return null
        }

        const isValid = bcrypt.compareSync(credentials.password, dbUser.password ?? "")
        if (!isValid) {
          return null
        }

        return dbUser

      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma)
}

const AuthHandler = NextAuth(authOptions)

export { AuthHandler as GET, AuthHandler as POST };