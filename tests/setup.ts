import path from "path";
import { existsSync } from "fs";

const envTestPath = path.resolve(__dirname, "../.env.test");
if (existsSync(envTestPath)) {
  process.loadEnvFile(envTestPath);
}
