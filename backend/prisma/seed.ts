import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(dirname(__dirname), "..", ".env") });

type Datasources = { db: { url?: string } };
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } as Datasources["db"] },
});

console.log(
  `Using database: ${process.env.DATABASE_URL?.split("@")[1] || "undefined"}
`,
);

async function main() {
  const sqlFile = join(__dirname, "seed.sql");
  let sql = readFileSync(sqlFile, "utf-8");

  console.log(`Clearing existing test data...`);

  const truncateStmt = `TRUNCATE TABLE
    public._prisma_migrations,
    public."WordsCorrectAnswer",
    public."WordsOption",
    public."WordsQuestion",
    public."CorrectAnswer",
    public."Option",
    public."Question",
    public."Session",
    public."QuizCompletion",
    public."User",
    public."Game"
  RESTART IDENTITY CASCADE;`;
  await prisma.$executeRawUnsafe(truncateStmt);

  console.log(`Executing seed SQL script (${sqlFile}) in a DO block...`);

  sql = sql.replace(
    /SELECT\s+pg_catalog\.set_config\(/g,
    "PERFORM pg_catalog.set_config(",
  );

  const wrappedSql = `DO $$
BEGIN
${sql}
END$$ LANGUAGE plpgsql;`;

  await prisma.$executeRawUnsafe(wrappedSql);
  console.log("Seed data injected successfully into test database");
}

main()
  .catch((e) => {
    console.error("Test seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
