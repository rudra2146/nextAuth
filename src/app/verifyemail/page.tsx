'use client'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-hot-toast';
const VerifyEmailPage = () => {

  // const router = useRouter();
  const [token, setToken] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const verifyUserEmail = async () => {
    try {
      await axios.post('/api/users/verifyemail', { token });
      setVerified(true);
      setError(false);
      toast.success("Email verified successfully!");
  
      // Optional: Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error: any) {
      setError(true);
      toast.error(error.response?.data?.error || "Verification failed");
      console.error(error.response?.data);
    }
  };

  useEffect(()=>{
    setError(false)
    const urlToken = window.location.search.split('=')[1]
    setToken(urlToken||"")

    // const {query}=router;
    // const urlTokenTwo = query.token
  },[])

  useEffect(()=>{
    setError(false)
    if(token.length>0){
      verifyUserEmail()
    }
  },[token])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl'>Verify Email</h1>
      <h2 className='p-2 bg-orange-500 text-black'>
        {token ? token : 'No token found in URL'}
      </h2>
  
      {loading && <p>Verifying your email...</p>}
  
      {!loading && verified && (
        <div className='text-green-500'>
          <h2>Email Verified ✅</h2>
          <Link href='/login'>Go to Login</Link>
        </div>
      )}
  
      {!loading && error && (
        <div className='text-red-500'>
          <h2>Verification Failed ❌</h2>
          <p>Try requesting a new verification email.</p>
        </div>
      )}
    </div>
  );
  
}

export default VerifyEmailPage