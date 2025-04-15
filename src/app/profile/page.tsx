'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please log in first')
      router.push('/login')
    }
  }, [status])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile page</h1>
      <hr />
      <h2>
        {session?.user?._id ? (
          <a href={`/profile/${session.user._id}`}>{session.user._id}</a>
        ) : (
          'No User ID'
        )}
      </h2>
      <hr />
      <button
        className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  )
}

export default ProfilePage