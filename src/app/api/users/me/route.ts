import {connectDB} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import { NextRequest,NextResponse} from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDataFromToken } from '@/helpers/getDataFromToken'
connectDB()

export async function POST(request: NextRequest) {
    try {
      const userId = await getDataFromToken();
      if (!userId) {
        throw new Error('User ID not found in token');
      }
  
      const user = await User.findOne({ _id: userId }).select("-password");
      if (!user) {
        throw new Error('User not found');
      }
  
      return NextResponse.json({
        message: "User found",
        data: user
      });
    } catch (error: any) {
      console.error("Error fetching user:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  