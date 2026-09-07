import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Next persists unstable_cache records across builds. When local/e2e databases
// share a checkout, retain compiler caches but never reuse another DB's data.
if (existsSync(".env")) process.loadEnvFile(".env");
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  const cacheDirectory = path.resolve(
    process.env.ATOI_BUILD_DIR || ".next",
    "cache",
  );
  const marker = path.join(cacheDirectory, "atoi-data-source");
  const namespace = createHash("sha256").update(databaseUrl).digest("hex");
  let previous;
  try {
    previous = await readFile(marker, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (previous !== namespace) {
    await rm(path.join(cacheDirectory, "fetch-cache"), {
      recursive: true,
      force: true,
    });
    await mkdir(cacheDirectory, { recursive: true });
    await writeFile(marker, namespace);
  }
}
