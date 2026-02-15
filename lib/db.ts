import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const isAccelerate = url.startsWith("prisma+postgres://") || url.startsWith("prisma://");
  const logOptions: ("query" | "error" | "warn")[] =
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"];
  if (isAccelerate) {
    return new PrismaClient({
      accelerateUrl: url,
      log: logOptions,
    }).$extends(withAccelerate()) as unknown as PrismaClient;
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: logOptions,
  });
}

/** Lazy singleton: só conecta ao banco em runtime, nunca durante o build. */
function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrisma();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string) {
    return (getPrisma() as unknown as Record<string, unknown>)[prop];
  },
});
