/**
 * ---------------------------------------------------------
 *  AI-Powered Code Optimizer - Analyzer Orchestrator (v3)
 * ---------------------------------------------------------
 *  Improvements:
 *    ✅ Auto-detect controller directory (anywhere in project)
 *    ✅ Works even if controller path is not relative
 *    ✅ Fully dynamic, no hardcoded folder assumptions
 * ---------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import url from "url";
import inquirer from "inquirer";
import * as routeReflector from "./route-reflector.js";
import * as astParser from "./ast-parser.js";
import * as logicExtractor from "./logic-extractor.js";
import * as sanitizer from "./sanitizer.js";
import * as serializer from "./serializer.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startAnalyzer() {
  console.log("\n🚀 Starting Analyzer...");
  console.log("📂 Working directory:", __dirname);

  const cliRouteArg = process.argv[2];
  const routesDir = path.join(process.cwd(), "routes"); // dynamic base for user's project

  if (!fs.existsSync(routesDir)) {
    console.error("❌ Routes folder not found:", routesDir);
    return;
  }

  let selectedRouteFile = cliRouteArg;
  if (!selectedRouteFile) {
    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith(".js"));
    const { selectedRouteFile: chosenFile } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedRouteFile",
        message: "📁 Select which router file you want to analyze:",
        choices: routeFiles,
      },
    ]);
    selectedRouteFile = chosenFile;
  }

  const selectedRoutePath = path.join(routesDir, selectedRouteFile);
  const routeContent = fs.readFileSync(selectedRoutePath, "utf8");

  // ✅ Detect controller imports
  const controllerImports = {};
  const importPattern =
    /import\s*\{\s*([^}]+)\s*\}\s*from\s*["'](.*controllers\/[A-Za-z0-9_.-]+)["']/g;
  let match;
  while ((match = importPattern.exec(routeContent)) !== null) {
    const handlers = match[1].split(",").map(h => h.trim());
    const file = match[2];
    for (const h of handlers) controllerImports[h] = file;
  }

  const endpoints = routeReflector.scanRoutesFile(selectedRoutePath);
  if (!endpoints.length) {
    console.warn("⚠️ No endpoints found in this route file.");
    return;
  }

  const { selectedEndpoints } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedEndpoints",
      message: "🧠 Select which endpoints to analyze:",
      choices: endpoints.map(ep => `${ep.method.toUpperCase()} ${ep.path} → ${ep.handler}`),
      pageSize: 10,
      validate: input => input.length > 0 || "Select at least one endpoint to analyze.",
    },
  ]);

  console.log(`\n📊 Selected ${selectedEndpoints.length} endpoint(s):`);
  selectedEndpoints.forEach(e => console.log(`   • ${e}`));

  for (const selected of selectedEndpoints) {
    const endpoint = endpoints.find(
      ep => `${ep.method.toUpperCase()} ${ep.path} → ${ep.handler}` === selected
    );
    if (!endpoint) continue;

    // ✅ Dynamically resolve controller location
    const controllerImportPath = controllerImports[endpoint.handler];
    let controllerFile = "";

    if (controllerImportPath) {
      // Case 1: Relative import (like ../controllers/x.controller.js)
      if (controllerImportPath.startsWith(".")) {
        controllerFile = path.resolve(path.dirname(selectedRoutePath), controllerImportPath);
      } else {
        // Case 2: Non-relative import (e.g., controllers/x.controller.js)
        const projectRoot = process.cwd();
        controllerFile = path.join(projectRoot, controllerImportPath);
      }
    } else {
      // Case 3: Fallback — search entire project for matching controller
      const controllerNameGuess = endpoint.handler.replace(/([A-Z]).*/, "").toLowerCase();
      const allFiles = findAllControllers(process.cwd());
      const possible = allFiles.find(f => f.includes(controllerNameGuess + ".controller.js"));
      controllerFile = possible || "";
    }

    if (!controllerFile || !fs.existsSync(controllerFile)) {
      console.warn(`⚠️ Controller file not found for handler '${endpoint.handler}'.`);
      continue;
    }

    console.log(`\n🧩 Extracting Function: ${endpoint.handler} from ${path.basename(controllerFile)}`);

    const extracted = astParser.extractFunctionCode(controllerFile, endpoint.handler);
    if (!extracted) {
      console.warn(`⚠️ Handler '${endpoint.handler}' not found in ${path.basename(controllerFile)}`);
      continue;
    }

    const refined = logicExtractor.refineFunctionLogic(extracted);
    const safe = sanitizer.sanitizeCode(refined.cleanedCode);
    const payload = serializer.buildPayload(endpoint, refined, safe);
    const savedFile = serializer.savePayload(payload, "analysis_reports");

    console.log("📜 Cleaned Code:\n", refined.cleanedCode);
    console.log("📊 Summary:", refined.summary);
    console.log("🛡️ Sanitized Code:\n", safe.safeCode);
    console.log("💾 Payload saved to:", savedFile);
  }

  console.log("\n✅ Analyzer complete for selected endpoints.\n");
}

/**
 * Recursively find all controller files in user's project.
 */
function findAllControllers(baseDir) {
  const result = [];
  function search(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) search(full);
      else if (entry.name.endsWith(".controller.js")) result.push(full);
    }
  }
  try {
    search(baseDir);
  } catch {}
  return result;
}

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  startAnalyzer();
}

export { startAnalyzer };
