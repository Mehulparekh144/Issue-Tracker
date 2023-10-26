"use client"
import { trpc } from '@/app/_trpc/client'
import React from 'react'

function page() {
  const {data , isLoading , error} = trpc.getAllUsers.useQuery();
  console.log(data);

  // To add table
  // Horizontal scrollbar
  // Pagination for 5 users per page
  
  return (
    <div></div>
  )
}

export default page