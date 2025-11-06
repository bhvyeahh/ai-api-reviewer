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
    ## ⚙️ Environment Variables

To run this project, you’ll need to add the following environment variables to your `.env` file  
(You can place it in your project’s root folder)

| Variable | Description |
| :-------- | :----------- |
| `GEMINI_API_KEY` | **Required.** Your Google Gemini API key for AI code analysis |
| `GEMINI_DEFAULT_MODEL` | *(Optional)* Default model used for analysis — e.g. `gemini-1.5-flash` |
| `NODE_ENV` | *(Optional)* Environment mode (`development` / `production`) |

**Example `.env` file:**
```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_DEFAULT_MODEL=gemini-1.5-flash
NODE_ENV=development

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

## Badges
## 🏷️ Badges

Add some visual flair to your project using these Shields.io badges 👇  

[![npm version](https://img.shields.io/npm/v/ai-api-reviewer.svg?color=brightgreen&label=Version)](https://www.npmjs.com/package/ai-api-reviewer)
[![npm downloads](https://img.shields.io/npm/dt/ai-api-reviewer?color=blue&label=Downloads)](https://www.npmjs.com/package/ai-api-reviewer)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Built with Node.js](https://img.shields.io/badge/Built%20With-Node.js-darkgreen?logo=node.js)](https://nodejs.org/)
[![Made with ❤️ by Bhavya Rathore](https://img.shields.io/badge/Made%20with%20❤️%20by-Bhavya%20Rathore-red.svg)](https://github.com/bhvyeahh)
## Authors

- [@bhvyeahh](https://www.github.com/bhvyeahh)


## Feedback

If you have any feedback, please reach out to me at bhavyarathore575@gmail.com

## License

[MIT](https://choosealicense.com/licenses/mit/)
