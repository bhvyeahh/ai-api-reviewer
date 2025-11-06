# 🤖 AI API Reviewer CLI

### An AI-powered Express.js code analysis tool for developers

**AI API Reviewer** is a smart command-line utility that automatically scans your Express.js routes, extracts controller logic, and sends the sanitized code to Gemini AI for optimization insights.  
It helps backend developers identify **performance bottlenecks**, **bad practices**, and **improvement suggestions** — all with a single command.

---

✨ **Key Features**
- 🔍 Auto-detects Express route files and endpoints  
- 🧠 Uses Google Gemini AI to review code logic  
- 🧹 Cleans & sanitizes sensitive code before analysis  
- 📊 Generates structured JSON reports with improvement insights  
- ⚙️ Works globally via `npm install -g ai-api-reviewer`  
- 🪄 No setup required — just run `ai-review` inside your project

---

## Installation

Install my CLI with npm

```bash
  npm install -g ai-api-reviewer
  ai-review
```
    
## Authors

- [@bhvyeahh](https://www.github.com/bhvyeahh)

## 🗺️ Roadmap

The future plans for **AI API Reviewer CLI** include expanding its AI analysis capabilities, integrations, and developer usability.

- ✅ **v1.0.2 Released:**  
  - Stable Gemini AI analysis  
  - Global npm CLI support  
  - Route auto-detection & payload sanitization  

- 🚧 **Upcoming Features:**  
  - Support for **multiple frameworks** (NestJS, Koa, Fastify)  
  - **Custom AI model selection** (OpenAI GPT, Claude, Mistral)  
  - **Code optimization previews** (before → after visualization)  
  - Enhanced **multi-file project analysis**  
  - Export AI reports in **Markdown, PDF, and JSON**  

- 🧩 **Planned Enhancements:**  
  - **VS Code Extension** to review APIs directly inside editor  
  - **Web Dashboard** for visualizing AI insights interactively  
  - **CI/CD integration** (GitHub Actions / Jenkins) for automated code reviews  
  - **Custom prompt templates** for personalized AI analysis  

- 💡 **Long-Term Goals:**  
  - Full **AI DevOps Assistant** mode (detect inefficiencies pre-deploy)  
  - **Plugin Marketplace** for custom linting & AI rules  
  - Browser-based interactive version of the CLI  

---

> 🧠 *AI API Reviewer CLI is evolving into a full-fledged intelligent backend code auditor — powered by Gemini AI.*

## Demo

Insert gif or link to demo


## 📸 Screenshots (Step-by-step)

### Step 1 — Run CLI
![CLI Launch / Command](https://github.com/user-attachments/assets/b1f0d11b-f443-4cdf-895d-2df960b52de0)
**What this shows**
- You ran the CLI command: `ai-review`
- CLI boot sequence loads `.env` tips and starts the UI
- Ready to auto-detect routes in your project

---

### Step 2 — Auto-detected routes directory & file list
![Auto-detect routes & file list](https://github.com/user-attachments/assets/2f3af199-2919-4310-bd16-93a6b97c21d3)
**What this shows**
- CLI found the `routes/` directory automatically  
- Presents a list of route files detected (e.g., `auth.routes.js`, `user.routes.js`, `workflow.routes.js`)  
- User selects which route file to analyze interactively  

---

### Step 3 — Endpoint Selection
![Endpoint Selection](https://github.com/user-attachments/assets/67828988-aa9c-47ab-9a45-28dcdd899d56)
**What this shows**
- Once a route file is selected, the CLI scans and lists all endpoints inside it  
- You can choose one or multiple endpoints (like `/sign-up`, `/sign-in`, `/sign-out`)  
- Each endpoint corresponds to a specific controller function for deeper analysis  

---

### Step 4 — AI Analysis and Report Generation
![AI Report Process](https://github.com/user-attachments/assets/df599737-48cd-465b-ab39-85e165aa0ed5)
**What this shows**
- Gemini AI begins analyzing the selected endpoint’s controller logic  
- Generates a structured JSON report with insights like:
  - 🧠 Function summary  
  - ⚙️ Performance & optimization issues  
  - 💡 Suggested code improvements  
  - 🔐 Sanitized and cleaned code  
- The final report is saved inside `/ai_reports/` in your project  

---

✨ **End Result:**  
In just one command — `ai-review` — your entire Express.js API is scanned, analyzed, and optimized with **real AI insights** from Gemini.  
Perfect for debugging, learning, or showcasing clean backend practices 🚀
