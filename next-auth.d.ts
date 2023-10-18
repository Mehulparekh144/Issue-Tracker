import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"
import type {User} from 'next-auth'
type UserId = string

declare module "next-auth/jwt"{
  interface JWT{
    id : UserId
    role : UserRole
    image : string | null
}
}

declare module "next-auth" {
  interface Session {
    user : User & {
      id : UserId
      role : UserRole
      image : string | null 
    }
  }
}
