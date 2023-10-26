import NextAuth from 'next-auth/next'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/db'
import bcrypt from 'bcrypt'
import { NextAuthOptions } from 'next-auth'

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
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
          },
          include: {
            team: true,
            issues: true
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
  callbacks: {
    async session({ token, session }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id
          session.user.role = token.role
          session.user.name = token.name
          session.user.email = token.email
          session.user.image = token.image
        }
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email
        }
      })

      if (!dbUser) {
        token.id = user!.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        role: dbUser.role
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma)
}

const AuthHandler = NextAuth(authOptions)

export { AuthHandler as GET, AuthHandler as POST };