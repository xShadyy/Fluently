import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { gameId: 'game-proficiency' },
      include: { options: true, correctAnswer: true },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.error();
  }
}
