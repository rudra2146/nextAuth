import { connectDB } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();


export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("Received login request:", reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ No user found for", email);
      return NextResponse.json({ error: "No user found with this email or username" }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password for:", email);
      return NextResponse.json({ error: "Wrong password" }, { status: 400 });
    }

    console.log("✅ User authenticated");

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true
    });

    response.cookies.set("token", token, {
      httpOnly: true
    });

    return response;
  } catch (error: any) {
    console.error("❌ Error during login:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
