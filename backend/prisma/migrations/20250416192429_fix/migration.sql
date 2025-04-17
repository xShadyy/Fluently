/*
  Warnings:

  - You are about to drop the `QuizAchievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizAchievement" DROP CONSTRAINT "QuizAchievement_userId_fkey";

-- DropTable
DROP TABLE "QuizAchievement";
