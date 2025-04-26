import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Difficulty } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { level, score } = await request.json();

    if (level !== "BEGINNER") {
      const previousLevel =
        level === "INTERMEDIATE" ? "BEGINNER" : "INTERMEDIATE";
      const previousCompletion = await prisma.quizCompletion.findFirst({
        where: {
          userId: user.id,
          difficulty: previousLevel as Difficulty,
        },
      });

      if (!previousCompletion) {
        return NextResponse.json(
          { error: `Must complete ${previousLevel.toLowerCase()} level first` },
          { status: 400 },
        );
      }
    }

    const quizCompletion = await prisma.quizCompletion.upsert({
      where: {
        userId_difficulty: {
          userId: user.id,
          difficulty: level as Difficulty,
        },
      },
      update: {
        score: score,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        difficulty: level as Difficulty,
        score: score,
      },
    });

    return NextResponse.json({
      success: true,
      quizCompletion,
    });
  } catch (error) {
    console.error("Error updating quiz achievement:", error);
    return NextResponse.json(
      { error: "Failed to update quiz achievement" },
      { status: 500 },
    );
  }
}
