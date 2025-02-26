import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get("game");

    if (!game) {
      return NextResponse.json({ error: "Missing game parameter" }, { status: 400 });
    }

    const gameData = await prisma.game.findFirst({
      where: { name: game },
      include: {
        questions: {
          include: {
            options: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!gameData || !gameData.questions.length) {
      return NextResponse.json({ error: "No questions found for this game" }, { status: 404 });
    }

    return NextResponse.json({ questions: gameData.questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
