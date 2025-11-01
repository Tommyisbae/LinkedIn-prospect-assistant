
🚀 **LinkedIn Prospect Assistant**

A semi-automated Chrome Extension for intelligent prospecting on LinkedIn, powered by **Google’s Gemini AI**.
This tool is designed to be an intelligent companion for freelancers, sales professionals, and networkers — helping them identify, analyze, and engage with high-quality prospects in a safe and compliant manner.
Built using the **React + TypeScript + Vite** template.

---

### 🧭 Core Philosophy & Compliance

This tool operates on a strict **“human-in-the-loop”** principle. It’s an assistive tool — not a fully automated one.

✅ **We Do**

* Use AI for intelligent analysis, data extraction, and message drafting.
* Require that every action (sending messages or connection requests) be **manually executed** by the user.

❌ **We Don’t**

* Automate messaging, connection requests, or any other behavior that violates **LinkedIn’s Terms of Service**.
* Store or transmit user data externally — everything is saved **locally** for privacy.

The goal is to **augment** your workflow, not replace it — ensuring safety and integrity for your LinkedIn account.

---

### ✨ Key Features

💼 **Profile Collection** – Capture prospect profiles from LinkedIn search results or comment sections.
🔁 **Duplicate Prevention** – Automatically ignores prospects already in your “Captured” list.
🤖 **On-Demand AI Analysis** – One-click deep analysis of a prospect’s profile via a background service worker.
👀 **Human-in-the-Loop Verification** – Review scraped profile data before analysis for quality control.
🎯 **Template-Based Scoring** – AI evaluates prospects based on your goals (e.g. “Peer Networking” or “Target Audience”) and your professional profile.
💬 **AI-Generated Outreach** – Get a detailed report with:

* A relevance score
* A short justification
* A ready-to-copy, personalized connection message
  🔒 **Local & Secure** – Prospect data, reports, and API keys are stored securely using IndexedDB and Chrome storage.

---

### 🧰 Tech Stack

* Frontend: React, TypeScript, Tailwind CSS
* Build Tool: Vite
* Browser API: Chrome Extension Manifest V3
* Local Database: Dexie.js (IndexedDB wrapper)
* AI: Google Generative AI SDK (@google/generative-ai)

---

### ⚙️ Setup and Installation

Follow these steps to set up the extension locally.

**Prerequisites**

* Node.js (v18 or higher recommended)
* npm or yarn

**1️⃣ Clone the Repository**

```
git clone [URL_OF_YOUR_GIT_REPO]
cd linkedin-prospect-assistant
```

**2️⃣ Install Dependencies**

```
npm install
```

**3️⃣ Build the Extension**
Compile the TypeScript and React code into the static files used by the extension:

```
npm run build
```

A folder named **dist** will be created — this contains the complete extension package.

**4️⃣ Load the Extension in Chrome**

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the **dist** folder
5. You’ll see “LinkedIn Prospect Assistant” in your extension list — pin it to your toolbar for quick access.

---

### 🧠 How to Use

**Step 1 – Configure Settings**

1. Click the ⚙️ gear icon in the extension.
2. Fill in your profile info: Title, Industry, Skills.
3. Choose your default **Analysis Goal**.
4. Enter your **Gemini API Key**.
5. Click “Save Settings.”

**Step 2 – Capture Prospects**

* On a LinkedIn search page → click **“Capture (Search)”**
* On a LinkedIn post with comments → click **“Capture (Comments)”**
* New prospects appear in your **Captured** list (duplicates are ignored automatically).

**Step 3 – Analyze a Prospect**

1. Click on any prospect to start analysis.
2. The extension scrapes the profile in the background.
3. Review the scraped data for accuracy.
4. Click **“Proceed with AI Analysis”** if it looks correct.

**Step 4 – View the Report**

* The report includes a score, reasoning, and personalized message.
* The analyzed prospect is moved from **Captured** to your **History** tab for record keeping.

---

### 🛡️ Ethics & Compliance

This extension is designed for **ethical, human-supervised use**.
It never automates messaging or violates LinkedIn’s Terms of Service.
All AI interactions are **user-triggered** and fully transparent.

---

👨‍💻 **Created with ❤️ using React, TypeScript, Vite, and Gemini AI.**


