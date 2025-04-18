import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const sqlFile = join(__dirname, "seed.sql");
  const sql = readFileSync(sqlFile, "utf-8");
  await prisma.$executeRawUnsafe(sql);
  console.log("Seed data injected");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
