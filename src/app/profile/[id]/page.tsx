'use client'

import React from 'react'
import { useParams } from 'next/navigation'

const ProfilePage = () => {
  const params = useParams()
  const id = params?.id

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile page</h1>
      <h2 className='p-3 bg-green-500 rounded text-black'>
        {id}
      </h2>
    </div>
  )
}

export default ProfilePage
