import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../dbConfig/dbConfig';
import User from '@/models/userModel';

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ Google Sign-In
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        await connectDB();
      
        console.log("🧪 Received credentials:", credentials);
      
        if (!credentials?.identifier || !credentials?.password) {
          console.log("❌ Missing identifier or password");
          throw new Error('Missing email/username or password');
        }
      
        try {
          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
      
          if (!user) {
            throw new Error('No user found with this email or username');
          }
      
          // if (!user.isVerified) {
          //   console.log("❌ User not verified:", user.email);
          //   throw new Error('Please verify your account');
          // }
      
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
      
          if (!isPasswordCorrect) {
            console.log("❌ Incorrect password for user:", user.email);
            throw new Error('Incorrect password');
          }
      
          if (!user.isVerified) {
            user.isVerified = true;
            await user.save();
            console.log('✅ User marked as verified during login');
          }
      
          return {
            _id: user._id,
            email: user.email,
            username: user.username,
            isVerified: user.isVerified,
          };
        } catch (error: any) {
          console.log("❌ Error in authorize:", error);
          throw new Error(error.message || 'Login failed');
        }
      },      
    }),
  ],

  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        
        // Access Google user ID via profile.sub (Google user ID)
        token._id = profile?.sub;  // Google provides the user ID in 'sub'
        token.username = profile?.name ?? undefined;
        token.isVerified = true;  // Assuming Google users are verified by default
        console.log("Google sign-in detected", profile);
      }
  
      // Handle Credentials login
      if (user && account?.provider === "credentials") {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
      }
  
      return token;
    },
  
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        _id: token._id,
        username: token.username,
        isVerified: token.isVerified,
      };
      return session;
    },
  },  
  events: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/google-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              provider: "google",
            }),
          });

          if (!res.ok) {
            console.error("❌ Failed to sync Google user to backend:", await res.text());
          } else {
            console.log("✅ Google user synced to backend");
          }
        } catch (err) {
          console.error("❌ Google user sync error:", err);
        }
      }
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};