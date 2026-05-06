import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";

import { createApp } from "./app.js";

// Load env from apps/server/.env (if present), then fall back to repo root .env
dotenv.config();
dotenv.config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  if (!MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment.");
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
