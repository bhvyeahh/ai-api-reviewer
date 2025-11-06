/**
 * ---------------------------------------------------------
 *  Route Reflector (Universal Version)
 * ---------------------------------------------------------
 *  Detects Express endpoints from any router variable name.
 *  Handles:
 *   - router.METHOD("/path", handler)
 *   - customRouter.METHOD("/path", middleware, handler)
 *   - router.route("/path").get(handler).post(handler)
 * ---------------------------------------------------------
 */

import fs from "fs";

/**
 * Extract Express route endpoints from a file.
 * @param {string} filePath - path to the route file
 * @returns {Array<{ method: string, path: string, handler: string }>}
 */
export function scanRoutesFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn("⚠️ Route file not found:", filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8");
  const endpoints = [];

  // 1️⃣ Detect router variable name (like router, authRouter, cardRouter)
  const routerVarMatch = content.match(/const\s+(\w+)\s*=\s*Router\s*\(/);
  const routerVar = routerVarMatch ? routerVarMatch[1] : "router";

  // 2️⃣ Match simple patterns like: router.get("/path", authorize, handler)
  const simplePattern = new RegExp(
    `${routerVar}\\.(get|post|put|delete|patch|options|head)\\s*\\(\\s*['"\`](.*?)['"\`]\\s*,\\s*([\\w\\d_\\s,]+?)\\)`,
    "g"
  );

  let match;
  while ((match = simplePattern.exec(content)) !== null) {
    const method = match[1];
    const path = match[2];
    const handlersRaw = match[3]
      .split(",")
      .map(h => h.trim())
      .filter(Boolean);

    // Pick last handler (main controller function)
    const mainHandler = handlersRaw.pop();

    endpoints.push({
      method,
      path,
      handler: mainHandler,
    });
  }

  // 3️⃣ Match chained route pattern like: router.route("/x").get(handler).post(handler)
  const chainPattern = new RegExp(
    `${routerVar}\\.route\\(['"\`](.*?)['"\`]\\)((?:\\.\\s*(get|post|put|delete|patch|options|head)\\s*\\(\\s*([\\w\\d_]+)\\s*\\))+)+`,
    "g"
  );

  let chainMatch;
  while ((chainMatch = chainPattern.exec(content)) !== null) {
    const basePath = chainMatch[1];
    const methodsSection = chainMatch[2];

    const subPattern = /\.(get|post|put|delete|patch|options|head)\s*\(\s*([\w\d_]+)\s*\)/g;
    let subMatch;
    while ((subMatch = subPattern.exec(methodsSection)) !== null) {
      endpoints.push({
        method: subMatch[1],
        path: basePath,
        handler: subMatch[2],
      });
    }
  }

  if (endpoints.length === 0) {
    console.warn(`⚠️ No endpoints found in ${filePath}`);
  } else {
    console.log(`✅ Found ${endpoints.length} endpoint(s) in ${filePath}`);
  }

  return endpoints;
}
