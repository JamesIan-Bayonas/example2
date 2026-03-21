# Gemini Code Assist - Architecture & Performance Rules

## 🏗️ Project Context: The "Isdalog" Microsystem
This workspace contains two distinct, communicating projects:
1. **Backend API (`isdalog`):** A Laravel (PHP) application handling database logic, models (e.g., `Catch`, `User`), and API endpoints.
2. **AI & Bot Service (`fisheries-ai`):** A Node.js application utilizing `telegraf` for Telegram bot interactions and `@google/genai` for AI processing.

## ⚡ STRICT PERFORMANCE RULES (CRITICAL)
Your rendering engine causes severe UI lag in this environment. To prevent Visual Studio Code from freezing, you MUST adhere to these exact output constraints:

1. **ZERO CODE DIFFS:** Never generate inline diffs, search-and-replace blocks, or partial code snippets using `...` (ellipses). Visual diffs crash the UI.
2. **COMPLETE BLOCKS ONLY:** Whenever modifying code, output the entire, fully updated function, method, or file from start to finish. I must be able to copy the block with a single click.
3. **STRICT EXCLUSIONS:** Do absolutely no background indexing or cross-referencing within `node_modules/`, `vendor/`, `storage/`, or `bootstrap/cache/`. Rely exclusively on the code provided in the active chat context.
4. **NO CHATTER:** Output the requested code block immediately. Keep all explanations and markdown formatting extremely brief and place them strictly *below* the code block.

## 🤝 Handshake & Integration Rules
* When generating code for the Laravel API (`isdalog/app/Http/Controllers/Api`), ensure it outputs clean, strictly typed JSON responses.
* When generating code for the Node service (`fisheries-ai/services`), ensure it gracefully handles asynchronous requests to the Laravel API and catches network timeouts.
* Maintain a security-first mindset: always sanitize inputs from the Telegram bot before passing them to the Laravel backend.