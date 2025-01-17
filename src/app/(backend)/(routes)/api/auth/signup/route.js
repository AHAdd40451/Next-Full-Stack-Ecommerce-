import { NextResponse } from 'next/server';
import { User } from '@/app/(backend)/models/user.model';
import { createAccessTokenForReset } from '@/app/(backend)/lib/tokens';
import { sendEmail } from '@/app/(backend)/lib/mailer';
import connectDB from '@/app/(backend)/lib/db';

export async function POST(request) {
  await connectDB();
  
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, password, and name are required fields." },
        { status: 400 }
      );
    }

    // Check for existing user
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.status === "verified") {
        return NextResponse.json({
          message: "Email is already in use.",
        }, { status: 403 });
      }

      // Resend verification email for pending users
      const token = createAccessTokenForReset(existingUser);
      const verificationLink = `${process.env.FRONTEND_URL}/api/auth/signup/verify?token=${token}`;

      await sendEmail({
        to: email,
        subject: role === "admin" ? "Admin Invitation Request" : "Verify Your Email",
        text: role === "admin"
          ? `You have been invited to join as an admin. Click the following link to accept the invitation: ${verificationLink}`
          : `Please verify your email by clicking this link: ${verificationLink}`
      });

      return NextResponse.json({
        message: role === "admin"
          ? "Account Already Exists. A new invitation email has been sent."
          : "Account exists. A new verification email has been sent.",
      }, { status: 403 });
    }

    // Create new user
    const user = new User({
      email,
      password: User.encryptPassword(password),
      name,
      role: role || 'user',
      status: 'pending'
    });

    const result = await user.save();

    // Send verification email
    const token = createAccessTokenForReset(user);
    const verificationLink = `${process.env.FRONTEND_URL}/api/auth/signup/verify?token=${token}`;

    await sendEmail({
      to: email,
      subject: role === "admin" ? "Complete Admin Registration" : "Verify Your Email",
      text: role === "admin"
        ? `Welcome! Please complete your admin registration by clicking this link: ${verificationLink}`
        : `Welcome to our platform! Please verify your email by clicking this link: ${verificationLink}`
    });

    return NextResponse.json({
      message: "User created successfully. Please check your email for verification.",
      id: result._id,
      status: 'pending'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({
        message: "Email already exists.",
      }, { status: 409 });
    }

    return NextResponse.json({
      message: "An error has occurred.",
      error: error.message
    }, { status: 500 });
  }
}