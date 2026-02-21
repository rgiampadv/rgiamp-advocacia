import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const DB_NOT_CONFIGURED = "DATABASE_URL is not set";
const DB_CONNECTION_FAILED = "Database connection failed";

/** Use to avoid calling Prisma when DB is not configured. */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    typeof process !== "undefined" &&
      process.env?.DATABASE_URL?.trim()
  );
}

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(DB_NOT_CONFIGURED);
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
    } as ConstructorParameters<typeof PrismaClient>[0]).$extends(withAccelerate()) as unknown as PrismaClient;
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: logOptions,
  } as ConstructorParameters<typeof PrismaClient>[0]);
}

/** No-op proxy: any use throws so callers can catch and handle. */
function createNoOpPrisma(message: string = DB_NOT_CONFIGURED): PrismaClient {
  const throwErr = () => {
    throw new Error(message);
  };
  return new Proxy({} as PrismaClient, {
    get(_, prop: string) {
      return new Proxy(throwErr, {
        apply: throwErr,
        get: () => new Proxy(throwErr, { apply: throwErr, get: () => throwErr }),
      });
    },
  });
}

/** Lazy singleton: só conecta ao banco em runtime, nunca durante o build. */
function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (!isDatabaseConfigured()) {
    globalForPrisma.prisma = createNoOpPrisma();
    return globalForPrisma.prisma;
  }
  try {
    const client = createPrisma();
    globalForPrisma.prisma = client;
    return client;
  } catch (err) {
    throw err;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string) {
    return (getPrisma() as unknown as Record<string, unknown>)[prop];
  },
});
