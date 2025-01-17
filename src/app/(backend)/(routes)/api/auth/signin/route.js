import { NextResponse } from 'next/server';
import { User } from '@/app/(backend)/models/user.model';
import { createAccessToken, createRefreshToken } from '@/app/(backend)/lib/tokens';
import connectDB from '@/app/(backend)/lib/db';

export async function POST(request) {
  await connectDB();
  
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { msg: "Email and password are required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    if (user.status !== "verified") {
      return NextResponse.json(
        { message: "User is not Verified" },
        { status: 401 }
      );
    }

    if (!user.validPassword(password)) {
      return NextResponse.json(
        { message: "Invalid Password." },
        { status: 401 }
      );
    }

    const token = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    return NextResponse.json({
      message: "Authenticated Successfully",
      token,
      refreshToken,
      email: user.email,
      name: user.name,
      status: user.status,
      uid: user._id,
      role: user.role
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Server error",
      error: error.message
    }, { status: 500 });
  }
}