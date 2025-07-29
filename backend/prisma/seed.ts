// Run this script with: npx ts-node prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      passwordHash,
    },
  });

  // Create collections (folders)
  const collection1 = await prisma.collection.create({
    data: {
      name: 'Travel Words',
      description: 'Words for travel',
      userId: user1.id,
    },
  });
  const collection2 = await prisma.collection.create({
    data: {
      name: 'Business Terms',
      description: 'Business vocabulary',
      userId: user1.id,
    },
  });
  const collection3 = await prisma.collection.create({
    data: {
      name: 'Food & Drink',
      description: 'Common food and drink words',
      userId: user1.id,
    },
  });
  const collection4 = await prisma.collection.create({
    data: {
      name: 'Daily Routine',
      description: 'Words for daily activities',
      userId: user2.id,
    },
  });
  const collection5 = await prisma.collection.create({
    data: {
      name: 'Technology',
      description: 'Tech-related vocabulary',
      userId: user2.id,
    },
  });

  // Create words (vocabs)
  await prisma.word.createMany({
    data: [
      // Travel Words
      {
        collectionId: collection1.id,
        word: 'airport',
        description: 'A place where airplanes land and take off',
        example: 'The airport is very busy today.'
      },
      {
        collectionId: collection1.id,
        word: 'passport',
        description: 'A document for international travel',
        example: 'Don\'t forget your passport!'
      },
      {
        collectionId: collection1.id,
        word: 'luggage',
        description: 'Bags and suitcases for travel',
        example: 'She packed her luggage.'
      },
      // Business Terms
      {
        collectionId: collection2.id,
        word: 'synergy',
        description: 'Combined power of a group',
        example: 'Team synergy is important in business.'
      },
      {
        collectionId: collection2.id,
        word: 'stakeholder',
        description: 'A person with an interest in a business',
        example: 'All stakeholders attended the meeting.'
      },
      // Food & Drink
      {
        collectionId: collection3.id,
        word: 'bread',
        description: 'A staple food made from flour',
        example: 'He bought fresh bread.'
      },
      {
        collectionId: collection3.id,
        word: 'coffee',
        description: 'A popular caffeinated drink',
        example: 'She drinks coffee every morning.'
      },
      // Daily Routine
      {
        collectionId: collection4.id,
        word: 'wake up',
        description: 'To stop sleeping',
        example: 'I wake up at 7am.'
      },
      {
        collectionId: collection4.id,
        word: 'commute',
        description: 'Travel to work or school',
        example: 'His commute takes 30 minutes.'
      },
      // Technology
      {
        collectionId: collection5.id,
        word: 'algorithm',
        description: 'A set of rules for solving a problem',
        example: 'The search algorithm is fast.'
      },
      {
        collectionId: collection5.id,
        word: 'database',
        description: 'An organized collection of data',
        example: 'The app uses a SQL database.'
      },
    ]
  });

  console.log('Mock data seeded!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
