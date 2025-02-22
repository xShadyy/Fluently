import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameName = searchParams.get("game") || "MultipleChoice";

    const game = await prisma.game.findUnique({
      where: { name: gameName },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ questions: game.questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
