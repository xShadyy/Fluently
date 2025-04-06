import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const questions = await prisma.question.findMany({
      where: { gameId: "game-proficiency" },
      include: {
        options: true,
        correctAnswer: {
          include: { option: true },
        },
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
