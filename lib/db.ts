import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/client/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'dev.db') 
    : './dev.db';

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || `file:${dbPath}`,
  });
  prismaInstance = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
