import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionId");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionId = sessionCookie.value;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  if (new Date() > session.expiresAt) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const { id, username, email, createdAt } = session.user;
  return NextResponse.json({ user: { id, username, email, createdAt } });
}

export async function PUT(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionId");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionId = sessionCookie.value;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  if (new Date() > session.expiresAt) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username } = body;

    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "Username cannot be empty" },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
