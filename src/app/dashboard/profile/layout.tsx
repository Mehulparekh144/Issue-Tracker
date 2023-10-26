import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProfileUserContent from '@/components/dashboard/ProfileUserContent'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function layout() {
  const session = await getServerSession(authOptions)
  if(!session || !session.user){
    redirect("/auth-callback?origin=profile")
  }
  else{
    return (
      <MaxWidthWrapper className='mt-12'>
      <ProfileUserContent email={session.user.email} id={session.user.id} image={session.user.image} name={session.user.name} role={session.user.role} />
      </MaxWidthWrapper>
    );
  }
}
