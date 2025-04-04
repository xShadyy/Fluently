import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.wordsQuestion.findMany({
      where: { difficulty: "INTERMEDIATE", game: { type: "WORDS" } },
      include: { options: true, correctAnswer: { include: { wordsOption: true } } },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}