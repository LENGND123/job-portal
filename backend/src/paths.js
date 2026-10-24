import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const uploadsDir = path.join(backendRoot, "uploads");
export const dataDir = path.join(backendRoot, "data", "mongo");

export function ensureDirs() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.mkdirSync(dataDir, { recursive: true });
}
