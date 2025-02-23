import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert the game so it won't create duplicates if you run the script multiple times
  const game = await prisma.game.upsert({
    where: { name: "MultipleChoice" },
    update: {},
    create: {
      name: "MultipleChoice",
      description: "Multiple choice game questions",
    },
  });

  // Create a question for the game
  const question = await prisma.question.create({
    data: {
      text: "What is the Spanish word for 'apple'?",
      gameId: game.id,
      // Leave correctOptionId blank for now; we'll update after creating the options
      correctOptionId: "",
    },
  });

  // Create options individually to capture their IDs
  const option1 = await prisma.option.create({
    data: { text: "Manzana", questionId: question.id },
  });
  const option2 = await prisma.option.create({
    data: { text: "Naranja", questionId: question.id },
  });
  const option3 = await prisma.option.create({
    data: { text: "Pera", questionId: question.id },
  });

  // Assume the correct answer is "Manzana", so update the question with option1's id
  await prisma.question.update({
    where: { id: question.id },
    data: { correctOptionId: option1.id },
  });

  console.log("Seeded game with a sample question and options.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
