import { NextResponse } from 'next/server';
import { User } from '@/app/(backend)/models/user.model';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/(backend)/lib/db';

export async function GET(request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.status === "verified") {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // Update user status
    user.status = "verified";
    await user.save();

    // Redirect to frontend success page
    return NextResponse.redirect(
      `${process.env.FRONTEND_URL}/signin?verified=true`
    );

  } catch (error) {
    console.error('Email verification error:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: "Invalid verification token" },
        { status: 400 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { message: "Verification token has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "An error occurred during verification",
      error: error.message
    }, { status: 500 });
  }
}