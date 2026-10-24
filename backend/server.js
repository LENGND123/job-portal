import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { app } from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import { ensureDirs } from "./src/paths.js";
import { seedIfEmpty } from "./src/utils/seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const port = Number(process.env.PORT) || 8000;

async function main() {
  ensureDirs();
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    const { embeddedMongoUri } = await import("./src/config/db-local.js");
    process.env.MONGO_URI = await embeddedMongoUri();
  }
  await connectDb();
  await seedIfEmpty();
  app.listen(port, () => {
    console.log(`JobPortal API listening on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start the API.");
  console.error(error);
  process.exit(1);
});
