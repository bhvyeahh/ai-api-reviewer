// /**
//  * src/genai/client.js
//  *
//  * Gemini (Google GenAI) client wrapper for the AI-Powered Code Optimizer.
//  */

// import dotenv from "dotenv";
// dotenv.config();

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import pRetry from "p-retry";

// let genaiClient = null;
// let DEFAULT_MODEL = process.env.GEMINI_DEFAULT_MODEL || "gemini-1.5-flash";

// // ✅ Initialize Gemini Client (no @google/genai nonsense)
// try {
//   genaiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// } catch (err) {
//   console.error(
//     "❌ Failed to initialize @google/generative-ai.\nMake sure you installed it and set GEMINI_API_KEY in .env",
//     err.message || err
//   );
//   genaiClient = null;
// }

// /**
//  * Build prompt for analysis.
//  */
// function buildAnalysisPrompt(payload) {
//   const ep = payload.endpoint || {};
//   const fn = payload.function || {};
//   const meta = payload.metadata || {};

//   return [
//     `You are an expert Node.js/Express backend engineer focused on performance and scalability.`,
//     `Analyze the following Express API endpoint and provide:`,
//     `  1) Short summary (1-2 lines)`,
//     `  2) Performance issues (bulleted)`,
//     `  3) Concrete optimizations (code-level)`,
//     `  4) Difficulty + impact rating`,
//     `  5) Before -> After pseudo code`,
//     ``,
//     `Reply in JSON with keys: summary, issues, suggestions, before_after, notes.`,
//     ``,
//     `Endpoint: [${ep.method}] ${ep.path} (${ep.handler})`,
//     `Function name: ${fn.name || "unknown"} | Async: ${fn.async}`,
//     `Metadata: ${JSON.stringify(meta)}`,
//     ``,
//     "```js",
//     fn.sanitizedCode || fn.cleanedCode || "// no code provided",
//     "```",
//   ].join("\n");
// }

// /**
//  * Call Gemini and get JSON response.
//  */
// async function generateTextWithGenAI(model, prompt) {
//   if (!genaiClient) {
//     throw new Error(
//       "❌ GenAI client not initialized. Install @google/generative-ai and set GEMINI_API_KEY in .env"
//     );
//   }

//   const modelInstance = genaiClient.getGenerativeModel({ model });

//   try {
//     const result = await modelInstance.generateContent(prompt);
//     const text =
//       result?.response?.text() ||
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       JSON.stringify(result);
//     return text;
//   } catch (err) {
//     console.error("❌ Error calling Gemini:", err.message || err);
//     throw err;
//   }
// }

// /**
//  * Analyze Endpoint with retry + structured return.
//  */
// export async function analyzeEndpoint(payload, opts = {}) {
//   if (!payload?.function) {
//     throw new Error(
//       "analyzeEndpoint expects payload.function.cleanedCode/sanitizedCode"
//     );
//   }

//   const model = opts.model || DEFAULT_MODEL;
//   const prompt = buildAnalysisPrompt(payload);

//   const run = async () => {
//     const raw = await generateTextWithGenAI(model, prompt);
//     let parsed = null;
//     try {
//       const jsonStart = raw.indexOf("{");
//       const jsonEnd = raw.lastIndexOf("}");
//       if (jsonStart >= 0 && jsonEnd > jsonStart) {
//         parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
//       }
//     } catch {
//       parsed = null;
//     }
//     return { raw, parsed };
//   };

//   return await pRetry(run, {
//     retries: opts.retries ?? 3,
//     onFailedAttempt: (err) => console.warn("⚠️ Retry:", err.message),
//   });
// }

// /**
//  * Dynamically change model.
//  */
// export function setModel(modelId) {
//   DEFAULT_MODEL = modelId;
// }

// export default { analyzeEndpoint, setModel };

/**
 * ---------------------------------------------------------
 *  src/genai/client.js
 * ---------------------------------------------------------
 *  Gemini (Google Generative AI) client wrapper
 *  for the AI-Powered Express API Optimizer.
 *
 *  ✅ Supports:
 *   - Global CLI installs (npm -g)
 *   - Local development mode
 *   - Auto-retries and JSON parsing
 * ---------------------------------------------------------
 */

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import pRetry from "p-retry";

let genaiClient = null;
let DEFAULT_MODEL = process.env.GEMINI_DEFAULT_MODEL || "gemini-1.5-flash";

/**
 * 🔑 Validate API key before initialization
 */
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ Missing GEMINI_API_KEY in your .env file.\n" +
      "   Please create a .env and add: GEMINI_API_KEY=your_google_genai_key_here"
  );
  process.exit(1);
}

/**
 * ✅ Initialize Gemini Client (correct official syntax)
 */
try {
  genaiClient = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
} catch (err) {
  console.error(
    "❌ Failed to initialize @google/generative-ai.\n" +
      "   Make sure it's installed and GEMINI_API_KEY is valid.",
    err.message || err
  );
  genaiClient = null;
}

/**
 * 🧠 Build AI analysis prompt
 */
function buildAnalysisPrompt(payload) {
  const ep = payload.endpoint || {};
  const fn = payload.function || {};
  const meta = payload.metadata || {};

  return [
    `You are an expert Node.js/Express backend engineer focused on performance and scalability.`,
    `Analyze the following Express API endpoint and provide:`,
    `  1) Short summary (1–2 lines)`,
    `  2) Performance issues (bulleted)`,
    `  3) Actionable optimizations (code-level)`,
    `  4) Difficulty & impact ratings`,
    `  5) Before → After pseudo-code (if applicable)`,
    ``,
    `Constraints:`,
    ` - Output ONLY valid JSON (no extra commentary).`,
    ` - Use keys: summary, issues, suggestions, before_after, notes.`,
    ``,
    `Endpoint: [${ep.method || "UNKNOWN"}] ${ep.path || "UNKNOWN"} (${ep.handler || "unknown"})`,
    `Function: ${fn.name || "anonymous"} | Async: ${fn.async || false}`,
    `Metadata: ${JSON.stringify(meta)}`,
    ``,
    `CODE:`,
    "```js",
    fn.sanitizedCode || fn.cleanedCode || "// no code provided",
    "```",
  ].join("\n");
}

/**
 * ⚙️ Generate response from Gemini
 */
async function generateTextWithGenAI(model, prompt) {
  if (!genaiClient) {
    throw new Error(
      "Gemini client not initialized. Install @google/generative-ai and check GEMINI_API_KEY."
    );
  }

  try {
    const modelInstance = genaiClient.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    const text =
      result?.response?.text() ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      JSON.stringify(result);

    return text;
  } catch (err) {
    console.error("❌ Error calling Gemini:", err.message || err);
    throw err;
  }
}

/**
 * 🚀 Analyze Endpoint with retry and structured output
 */
export async function analyzeEndpoint(payload, opts = {}) {
  if (!payload?.function) {
    throw new Error(
      "❌ analyzeEndpoint expects payload.function.cleanedCode or payload.function.sanitizedCode"
    );
  }

  const model = opts.model || DEFAULT_MODEL;
  const prompt = buildAnalysisPrompt(payload);

  const run = async () => {
    const raw = await generateTextWithGenAI(model, prompt);
    let parsed = null;

    try {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      }
    } catch {
      parsed = null;
    }

    return { raw, parsed };
  };

  return await pRetry(run, {
    retries: opts.retries ?? 3,
    onFailedAttempt: (err) =>
      console.warn("⚠️ Retry attempt due to:", err.message || "Unknown error"),
  });
}

/**
 * 🧩 Allow switching models dynamically
 */
export function setModel(modelId) {
  DEFAULT_MODEL = modelId;
}

export default { analyzeEndpoint, setModel };
