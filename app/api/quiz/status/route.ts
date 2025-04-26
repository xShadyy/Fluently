import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasCompletedProficiencyQuiz: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      hasCompleted: user.hasCompletedProficiencyQuiz,
    });
  } catch (error) {
    console.error("Error fetching quiz status from database:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
