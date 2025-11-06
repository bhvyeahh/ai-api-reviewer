#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╭──────────────────────────────╮
│ 🤖  AI Code Reviewer CLI v1  │
│  by Bhavya Rathore           │
╰──────────────────────────────╯
`);

try {
  const scriptPath = path.join(__dirname, "../src/scripts/run-full-analysis.js");
  execSync(`node "${scriptPath}"`, { stdio: "inherit" });
} catch (err) {
  console.error("❌ CLI failed:", err.message);
  process.exit(1);
}
