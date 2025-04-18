import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const completions = await prisma.quizCompletion.findMany({
      where: { userId: session.userId },
      select: { difficulty: true },
    });

    return NextResponse.json({
      beginner: completions.some((c) => c.difficulty === "BEGINNER"),
      intermediate: completions.some((c) => c.difficulty === "INTERMEDIATE"),
      advanced: completions.some((c) => c.difficulty === "ADVANCED"),
    });
  } catch (error) {
    console.error("Error fetching completion status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
