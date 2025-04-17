import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log("Quiz completion request received");
  const sessionCookie = request.cookies.get("sessionId");

  if (!sessionCookie) {
    console.log("No session cookie found");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sessionId = sessionCookie.value;
  console.log("Session ID:", sessionId);

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (new Date() > session.expiresAt) {
      console.log("Session expired");
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    console.log("Updating user quiz status:", session.user.id);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { hasCompletedProficiencyQuiz: true },
    });

    console.log("Quiz status updated successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quiz status:", error);
    return NextResponse.json(
      { error: "Failed to update quiz status" },
      { status: 500 },
    );
  }
}
