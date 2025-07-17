// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Esta declaración asegura que solo haya una instancia de PrismaClient en el entorno global.
// Esto es crucial en desarrollo para evitar agotar las conexiones a la base de datos
// con la recarga rápida de Next.js.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Se exporta una instancia de Prisma. Si ya existe una en el entorno global,
// se reutiliza. Si no, se crea una nueva.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Opcional: puedes descomentar la siguiente línea para ver las consultas de Prisma en la consola,
    // lo cual es muy útil para depurar.
    // log: ['query', 'info', 'warn', 'error'],
  });

// En entornos que no son de producción, asignamos la instancia de Prisma al objeto global.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}