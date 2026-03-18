import DashboardClient from '@/components/DashboardClient'
import { getSession } from '@/lib/getSession'
import React from 'react'

async function page(){

const session = await getSession()

  return (
    <div>
      <DashboardClient ownerId={session?.user?.id!} email={session?.user?.email!}/>
    </div>
  )
}

export default page
