const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

db.$queryRawUnsafe("SELECT 1")
  .then((result) => {
    console.log("PRISMA_OK", result);
  })
  .catch((error) => {
    console.error("PRISMA_ERROR", error.message);
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
