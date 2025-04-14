import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate(
    { email: session.user.email },
    { password: hashedPassword, hasPassword: true }
  );

  return NextResponse.json({ message: "Password set successfully" });
}
