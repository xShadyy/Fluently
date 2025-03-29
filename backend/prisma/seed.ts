// File: backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const seedFilePath = path.join(__dirname, 'seed.sql');
  const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

  const queries = seedSQL
    .split(';')
    .map(query => query.trim())
    .filter(query => query.length > 0);

  console.log(`Seeding database with ${queries.length} queries...`);

  for (const query of queries) {
    console.log(`Executing query: ${query.substring(0, 50)}...`);
    await prisma.$executeRawUnsafe(query);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
