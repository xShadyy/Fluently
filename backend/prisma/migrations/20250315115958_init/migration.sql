-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('WORDS', 'ENGLISH_GRAMMAR_TEST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GameType" NOT NULL DEFAULT 'WORDS',

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "CorrectAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordsQuestion" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "WordsQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordsOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "wordsQuestionId" TEXT NOT NULL,

    CONSTRAINT "WordsOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordsCorrectAnswer" (
    "id" TEXT NOT NULL,
    "wordsQuestionId" TEXT NOT NULL,
    "wordsOptionId" TEXT NOT NULL,

    CONSTRAINT "WordsCorrectAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectAnswer_questionId_key" ON "CorrectAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "CorrectAnswer_optionId_key" ON "CorrectAnswer"("optionId");

-- CreateIndex
CREATE UNIQUE INDEX "WordsCorrectAnswer_wordsQuestionId_key" ON "WordsCorrectAnswer"("wordsQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "WordsCorrectAnswer_wordsOptionId_key" ON "WordsCorrectAnswer"("wordsOptionId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectAnswer" ADD CONSTRAINT "CorrectAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorrectAnswer" ADD CONSTRAINT "CorrectAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordsQuestion" ADD CONSTRAINT "WordsQuestion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordsOption" ADD CONSTRAINT "WordsOption_wordsQuestionId_fkey" FOREIGN KEY ("wordsQuestionId") REFERENCES "WordsQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordsCorrectAnswer" ADD CONSTRAINT "WordsCorrectAnswer_wordsQuestionId_fkey" FOREIGN KEY ("wordsQuestionId") REFERENCES "WordsQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordsCorrectAnswer" ADD CONSTRAINT "WordsCorrectAnswer_wordsOptionId_fkey" FOREIGN KEY ("wordsOptionId") REFERENCES "WordsOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
