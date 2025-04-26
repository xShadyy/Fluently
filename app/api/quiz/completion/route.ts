import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    const completions = await prisma.quizCompletion.findMany({
      where: {
        userId: user.id,
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
