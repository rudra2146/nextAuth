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
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    console.log("✅ User exists");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Check your credentials" }, { status: 400 });
    }

    // Update the user's verification status on successful login
    // if (!user.isVerified) {
    //   user.isVerified = true;  // Mark the user as verified
    //   await user.save();       // Persist the change in the database
    //   console.log("✅ User marked as verified on login");
    // }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({
      message: "Logged in successfully",
      success:true
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
