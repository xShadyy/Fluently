import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    const completions = await prisma.quizCompletion.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      completions,
    });
  } catch (error) {
    console.error("Error fetching quiz completions:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz completions" },
      { status: 500 },
    );
  }
}
