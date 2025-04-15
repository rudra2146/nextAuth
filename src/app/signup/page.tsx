'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from "next/link";
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
  const router = useRouter()

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: ""
  })

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSignUp = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/users/signup', user)
      console.log("Signup success", response.data)
      toast.success(response.data.message || "Signup successful")
      router.push('/login')

    } catch (error: any) {
      console.log("Signup failed", error.response?.data)
      const message =
        error.response?.data?.error ||   // Custom backend error message
        error.response?.data?.message || // If message key is used instead
        "Signup failed. Please try again."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>{loading ? 'Processing...' : 'Signup'}</h1>
      <hr />
      <label htmlFor="username">Username</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white'
        type="text"
        id='username'
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder='Username'
      />

      <label htmlFor="email">Email</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white'
        type="text"
        id='email'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder='Email'
      />

      <label htmlFor="password">Password</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white'
        type="password"
        id='password'
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder='Password'
      />

      <button
        onClick={onSignUp}
        disabled={buttonDisabled}
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {buttonDisabled ? "Please fill the form" : "Signup"}
      </button>

      <Link href={"/login"}>Visit login page</Link>
    </div>
  )
}

export default SignUpPage
