/**
 * ---------------------------------------------------------
 *  Full AI Analysis Pipeline
 * ---------------------------------------------------------
 *  Flow:
 *   1. Detect user project structure and find route folder
 *   2. Let user select router file from their project
 *   3. Run analyzer from this CLI’s src/analyzer
 *   4. Send results to Gemini AI and generate reports
 * ---------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import inquirer from "inquirer";
import { analyzeEndpoint } from "../genai/client.js";
import { cleanGeminiResponse } from "../genai/adapter.js";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import ora from "ora";

dotenv.config();

// ---------- Path Setup ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_ROOT = path.join(__dirname, "../.."); // CLI base directory
const USER_PROJECT_DIR = process.cwd(); // User’s current project directory

// Output folders in user's project
const ANALYSIS_DIR = path.join(USER_PROJECT_DIR, "analysis_reports");
const AI_REPORTS_DIR = path.join(USER_PROJECT_DIR, "ai_reports");
if (!fs.existsSync(AI_REPORTS_DIR)) fs.mkdirSync(AI_REPORTS_DIR, { recursive: true });

// ---------- Step 1: Detect & Select Route File ----------
async function selectRouteFile() {
  // Try common route paths
  let routesPath = path.join(USER_PROJECT_DIR, "src", "routes");
  const commonPaths = [
    path.join(USER_PROJECT_DIR, "src", "routes"),
    path.join(USER_PROJECT_DIR, "routes"),
    path.join(USER_PROJECT_DIR, "backend", "routes"),
    path.join(USER_PROJECT_DIR, "api", "routes"),
  ];

  if (!fs.existsSync(routesPath)) {
    const found = commonPaths.find(p => fs.existsSync(p));
    if (found) {
      routesPath = found;
      console.log(`📂 Auto-detected routes directory → ${found}`);
    } else {
      console.error("❌ Could not find a routes directory automatically.");
      console.log("💡 Please ensure you have routes in one of these paths:");
      console.log("   - src/routes");
      console.log("   - routes");
      console.log("   - backend/routes");
      console.log("   - api/routes");
      process.exit(1);
    }
  }

  // Get route files
  const files = fs.readdirSync(routesPath).filter(f => f.endsWith(".js"));
  if (files.length === 0) {
    console.error("⚠️ No route files found in your routes directory.");
    process.exit(1);
  }

  // Ask user which route file to analyze
  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "📁 Select which route file to analyze:",
      choices: files,
    },
  ]);

  return { selectedFile, routesPath };
}

// ---------- Step 2: Run Analyzer ----------
function runAnalyzer(selectedFile, routesPath) {
  console.log(`\n🚀 Running Analyzer for ${selectedFile}...\n`);
  const spinner = ora("Analyzing endpoints...").start();

  // Clean up old analysis before running
  if (fs.existsSync(ANALYSIS_DIR)) fs.rmSync(ANALYSIS_DIR, { recursive: true, force: true });
  fs.mkdirSync(ANALYSIS_DIR, { recursive: true });

  try {
    // Run the analyzer script inside this CLI package
    execSync(
      `node "${path.join(CLI_ROOT, "src/analyzer/index.js")}" "${selectedFile}" "${routesPath}"`,
      { stdio: "inherit" }
    );
    spinner.succeed("Analyzer complete.");
  } catch (err) {
    spinner.fail("Analyzer failed.");
    console.error("❌ Analyzer failed:", err.message);
    process.exit(1);
  }
}

// ---------- Step 3: Send Payloads to Gemini ----------
async function analyzeReports() {
  console.log("\n📂 Scanning analyzer output files...\n");

  if (!fs.existsSync(ANALYSIS_DIR)) {
    console.warn("⚠️ No analysis_reports folder found.");
    return;
  }

  const payloadFiles = fs
    .readdirSync(ANALYSIS_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("last_session"));

  if (payloadFiles.length === 0) {
    console.warn("⚠️ No payloads found. Did the analyzer run?");
    return;
  }

  for (const file of payloadFiles) {
    const payloadPath = path.join(ANALYSIS_DIR, file);
    const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
    const endpointName = payload.function?.name || "unknown";

    if (!payload.function?.cleanedCode && !payload.function?.sanitizedCode) {
      console.warn(`⚠️ Skipping ${file}: invalid payload structure.`);
      continue;
    }

    console.log(`🧠 Analyzing endpoint: ${endpointName} (${file})`);
    console.log("──────────────────────────────");

    try {
      const aiResult = await analyzeEndpoint(payload);
      const cleaned = cleanGeminiResponse(aiResult.raw || aiResult);

      const reportName = `${endpointName}_AI_Insights_${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;
      const reportPath = path.join(AI_REPORTS_DIR, reportName);

      fs.writeFileSync(reportPath, JSON.stringify(cleaned, null, 2));
      console.log(`✅ Saved Gemini report → ${reportPath}\n`);
    } catch (err) {
      console.error(`❌ Error analyzing ${file}:`, err.message);
    }
  }

  console.log("🎉 All selected endpoints analyzed successfully!\n");
}

// ---------- Step 4: Orchestrate Full Pipeline ----------
async function runFullPipeline() {
  const { selectedFile, routesPath } = await selectRouteFile();
  runAnalyzer(selectedFile, routesPath);
  await analyzeReports();
}

runFullPipeline();
