import Dashboard from '@/components/dashboard';
import { NEXT_AUTH } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

const page = async () => {
    const session = await getServerSession(NEXT_AUTH);
// console.log(session.user.id)
  return (
    <>
      <Dashboard />
    </>
  )
}

export default page