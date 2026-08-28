import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

if (databaseUrl.startsWith("file:")) {
  // SQLite configuration for local development
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

  const adapter = new PrismaBetterSqlite3({
    url: databaseUrl,
  });
  prisma = new PrismaClient({ adapter });
} else {
  // MariaDB/MySQL configuration for production
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

  try {
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      connectionLimit: 5,
    };

    const adapter = new PrismaMariaDb(config);
    prisma = new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to parse DATABASE_URL for MariaDB adapter:", error);
    throw new Error("Invalid DATABASE_URL configuration for production database.");
  }
}

// Prevent multiple instances of Prisma Client in development due to hot reloading
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
