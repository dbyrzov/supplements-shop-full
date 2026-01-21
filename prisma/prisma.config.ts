import { defineConfig } from "prisma/config";

export default defineConfig({
  client: {
    datasources: {
      db: process.env.DATABASE_URL,
    },
  },
});
