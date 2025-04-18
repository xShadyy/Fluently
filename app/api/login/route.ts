import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { email, password, keepLoggedIn, isRegister } = await request.json();

    if (isRegister) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const expiresAt = new Date();
    if (keepLoggedIn) {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1);
    }

    const session = await prisma.session.upsert({
      where: { userId: user.id },
      update: { expiresAt },
      create: {
        user: { connect: { id: user.id } },
        expiresAt,
      },
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username, // Updated from user.name to user.username
        email: user.email,
        createdAt: user.createdAt,
      },
    });

    response.cookies.set("sessionId", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}