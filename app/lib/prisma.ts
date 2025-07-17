// app/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Declaramos prisma con su tipo
let prisma: PrismaClient;

// Augment the NodeJS global type with our prisma instance
declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;