import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { email, name, provider } = await req.json();

    if (!email || !name || !provider) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Received data:", { email, name, provider });

    // Check if the user already exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await User.create({
        email,
        username: name,
        provider,
        isVerified: true,
        password: null, // Password is null for Google sign-in users
        hasPassword: false, // Initially, they don't have a password set
      });
    }

    // If user exists but doesn't have a password, send a response to redirect to the password set page
    if (!user.hasPassword) {
      return NextResponse.json({
        _id: user._id,
        email: user.email,
        username: user.username,
        redirectToSetPassword: true, // Flag for frontend to show password set page
      });
    }

    // Return user data if password is set
    return NextResponse.json({
      _id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (createError) {
    console.error("User creation failed:", createError);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
