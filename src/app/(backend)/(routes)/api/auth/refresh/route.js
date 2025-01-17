import { NextResponse } from 'next/server';
import { User } from '@/app/(backend)/models/user.model';
import { createAccessToken } from '@/app/(backend)/lib/tokens';
import { verifyRefreshToken } from '@/app/(backend)/lib/refreshToken';
import connectDB from '@/app/(backend)/lib/db';

export async function POST(request) {
  await connectDB();
  
  try {
    const { email, refreshToken, userId } = await request.json();

    // Validate required fields
    if (!email || !refreshToken || !userId) {
      return NextResponse.json({
        success: false,
        error: "Email, refresh token, and user ID are required."
      }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 400 });
    }

    // Verify refresh token
    const isValid = verifyRefreshToken(email, refreshToken);
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: "Invalid token, please try logging in again."
      }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = createAccessToken(user);

    return NextResponse.json({
      success: true,
      token: newAccessToken
    }, { status: 200 });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({
      success: false,
      error: "An error occurred while processing your request."
    }, { status: 500 });
  }
}
