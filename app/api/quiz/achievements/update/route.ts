import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionId");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionId = sessionCookie.value;

  try {
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

    const { level, score } = await request.json();

    const quizCompletion = await prisma.quizCompletion.upsert({
      where: {
        userId_difficulty: {
          userId: session.user.id,
          difficulty: level as Difficulty,
        },
      },
      update: {
        score: score,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        difficulty: level as Difficulty,
        score: score,
      },
    });

    return NextResponse.json({ 
      success: true,
      quizCompletion 
    });
  } catch (error) {
    console.error("Error updating quiz achievement:", error);
    return NextResponse.json(
      { error: "Failed to update quiz achievement" },
      { status: 500 },
    );
  }
} 