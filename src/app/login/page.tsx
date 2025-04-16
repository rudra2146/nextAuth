'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from "next/link";
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const syncGoogleUser = async () => {
      if (session?.user?.email && session.user.name) {
        try {
          const res = await axios.post('/api/auth/google', {
            email: session.user.email,
            name: session.user.name,
            provider: 'google',
          });
          console.log("✅ Google user synced:", res.data);
        } catch (err) {
          console.error("❌ Failed to sync Google user to backend:", err);
          toast.error("Failed to sync Google user");
        }
      }
    };

    syncGoogleUser();
  }, [session, router]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await signIn('credentials', {
        redirect: false,
        identifier: user.email,
        password: user.password,
      });

      if (res?.ok) {
        router.push('/profile');
      } else if (res?.error) {
        if (res.error.includes("No user")) {
          toast.error("Email not found. Please sign up first.");
        } else if (res.error.includes("Wrong password")) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error(res.error);
        }
      }
      

    } catch (error: any) {
      console.log("Login failed");
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  // If already signed in, show logout option
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
        >
          Sign out
        </button>
        <Link href="/profile" className="mt-4 text-blue-500 underline">Go to Profile</Link>
      </div>
    );
  }

  // Not signed in - show login form
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>{loading ? 'Processing...' : 'Login'}</h1>
      <hr className="w-full max-w-sm my-4" />

      <label htmlFor="email">Email</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white'
        type="text"
        id='email'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder='email'
      />

      <label htmlFor="password">Password</label>
      <input
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black bg-white'
        type="password"
        id='password'
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder='password'
      />

      <button
        onClick={onLogin}
        disabled={buttonDisabled}
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50'
      >
        {buttonDisabled ? "No login" : "Login"}
      </button>

      <p className="mb-2">Or use NextAuth:</p>
      <button
        onClick={() => signIn('google', { callbackUrl: '/profile' })}
        className='p-2 border border-blue-500 text-blue-500 rounded-lg mb-4 hover:bg-blue-50'
      >
        Sign in with Google
      </button>

      <Link href={"/signup"} className="text-blue-500 underline">Visit Signup page</Link>
    </div>
  );
};

export default LoginPage;