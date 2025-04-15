'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const ProfilePage = () => {
  const router = useRouter()
  const [data, setData] = useState('nothing')

  // Check login status on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.post('/api/users/me')
        setData(res.data.data._id)
      } catch (error) {
        toast.error('Please log in first')
        router.push('/login')
      }
    }
    checkLoginStatus()
  }, [])

  const logout = async () => {
    try {
      await axios.get('/api/users/logout')
      toast.success('Logout successful')
      router.push('/login')
    } catch (error: any) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Profile page</h1>
      <hr />
      <h2>{data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
        className='bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

export default ProfilePage
