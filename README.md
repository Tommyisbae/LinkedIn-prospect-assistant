Here’s a clean, professional **README.md** version of your project description — ready to drop into your repository 👇

---

````markdown
# LinkedIn Prospect Assistant

A **semi-automated Chrome Extension** for intelligent prospecting on LinkedIn, powered by **Google's Gemini AI**.  
This tool is designed to be an intelligent companion for freelancers, sales professionals, and networkers — helping them **identify, analyze, and engage with high-quality prospects** in a safe and compliant manner.

> Built using the **React + TypeScript + Vite** template.

---

## 🧭 Core Philosophy & Compliance

This tool operates on a strict **"human-in-the-loop"** principle.  
It is designed to be an assistive tool — **not a fully automated one**.

### ✅ We Do
- Leverage AI for intelligent analysis, data extraction, and message drafting.  
- Require every action (e.g., sending a message or connection request) to be **manually executed by the user**.

### ❌ We Don't
- Automate messaging, connection requests, or any other action that would violate **LinkedIn's Terms of Service**.  
- Store or transmit user data externally — **all data is stored locally** for privacy and security.

The primary goal is to **augment** your workflow, not replace it — ensuring safety and the integrity of your LinkedIn account.

---

## 🚀 Key Features

- **Profile Collection** – Capture prospect profiles from LinkedIn search results or comment sections.  
- **Duplicate Prevention** – Automatically ignores prospects already present in your "Captured" list.  
- **On-Demand AI Analysis** – One-click deep profile analysis using a background service worker.  
- **Human-in-the-Loop Verification** – Review all scraped data before running AI analysis.  
- **Template-Based Scoring** – AI scores prospects based on user-defined goals and your own professional profile.  
- **AI-Generated Outreach** – Generates a comprehensive report with:
  - Prospect score  
  - Justification  
  - Personalized, context-aware connection message  
- **Local & Secure** – Uses IndexedDB and `chrome.storage` to store data and API keys securely on your machine.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Build Tool** | Vite |
| **Browser API** | Chrome Extension Manifest V3 |
| **Local Database** | Dexie.js (IndexedDB wrapper) |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai`) |

---

## ⚙️ Setup and Installation

Follow these steps to get the extension running in your local environment.

### Prerequisites
- **Node.js** (v18 or higher recommended)  
- **npm** or **yarn**

---

### 1️⃣ Clone the Repository
```bash
git clone [URL_OF_YOUR_GIT_REPO]
cd linkedin-prospect-assistant
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Build the Extension

This compiles the TypeScript and React code into static files used by the extension.

```bash
npm run build
```

This will create a **`dist/`** folder containing the loadable extension files.

---

### 4️⃣ Load the Extension in Chrome

1. Open **Google Chrome** and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **“Load unpacked”**
4. Select the `dist/` folder
5. The “LinkedIn Prospect Assistant” should now appear in your extensions list — **pin it** to your toolbar for easy access.

---

## 🧠 How to Use

### ⚙️ Configure Settings

1. Click the **gear icon (⚙️)** in the extension.
2. Fill in your profile details: Title, Industry, Skills.
3. Select your default **Analysis Goal**.
4. Enter your **Gemini API Key**.
5. Click **“Save Settings”**.

---

### 🧩 Capture Prospects

* Navigate to a **LinkedIn search results page** → click **“Capture (Search)”**
* Navigate to a **LinkedIn post with comments** → click **“Capture (Comments)”**
* New, unique prospects will appear in your **Captured** list.

---

### 🤖 Analyze a Prospect

1. Click any prospect in your list.
2. The extension scrapes and displays raw data for review.
3. Verify the data, then click **“Proceed with AI Analysis”**.

---

### 📊 View the Report

After a few seconds, you’ll see:

* A **score**
* A **justification**
* A **personalized, context-aware connection message**

The analyzed prospect is moved from **Captured** to your **History**, which can be accessed from the main screen.

---

## 🛡️ License & Compliance

This tool is built for ethical, human-supervised use.
It does **not** automate or mimic human behavior on LinkedIn.
All AI actions are user-initiated and comply with **LinkedIn’s Terms of Service**.

---

### 🌟 Credits

Developed with ❤️ using **React, Vite, and Gemini AI**.

```

---

Would you like me to add badges (e.g., “Built with React”, “License: MIT”, or “Powered by Gemini AI”) to make the top of the README look more polished?
```
