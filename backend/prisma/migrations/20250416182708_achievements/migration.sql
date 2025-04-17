-- CreateTable
CREATE TABLE "QuizAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "Difficulty" NOT NULL,
    "score" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizAchievement_userId_level_key" ON "QuizAchievement"("userId", "level");

-- AddForeignKey
ALTER TABLE "QuizAchievement" ADD CONSTRAINT "QuizAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
