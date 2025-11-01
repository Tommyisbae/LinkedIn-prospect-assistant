// background.ts

import { db, type Prospect } from "./src/lib/db";
import { callGemini } from "./src/lib/gemini";
import type { AppSettings } from "./src/lib/settings";

// Define a type for our temporary cache to make it type-safe
interface AnalysisCache {
  prospect: Prospect | null;
  scrapedData: any; // 'any' is okay here as it's raw scraped data
  settings: AppSettings | null;
}

// Initialize the cache with the correct type
let analysisCache: AnalysisCache = {
  prospect: null,
  scrapedData: null,
  settings: null,
};

// Listen for messages from the popup or other extension parts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyze-single-prospect") {
    // Add types to the data being passed
    startAnalysis(
      message.data.prospect as Prospect,
      message.data.settings as AppSettings
    );
  } else if (message.type === "proceed-with-ai-analysis") {
    proceedWithAI();
  }
  // Return true to indicate that we will send a response asynchronously
  return true;
});

/**
 * Creates a new tab, scrapes the profile, and sends the data back for review.
 */
async function startAnalysis(prospect: Prospect, settings: AppSettings) {
  analysisCache = { prospect, settings, scrapedData: null };
  let tempTabId: number | undefined;

  try {
    // Create a new, inactive tab with the prospect's URL
    const tab = await chrome.tabs.create({
      url: prospect.profileUrl,
      active: false,
    });
    tempTabId = tab.id;

    // --- THIS IS THE CORRECTED BLOCK ---
    // Use 'await' to get the results and remove the callback function.
    const results = await chrome.scripting.executeScript({
      target: { tabId: tempTabId! },
      files: ["deepProfileScraper.js"],
    });
    // ------------------------------------

    // The logic that was in the callback now goes here.
    if (results && results[0] && results[0].result) {
      analysisCache.scrapedData = results[0].result;
      // Send the scraped data to the popup for the user to review.
      chrome.runtime.sendMessage({
        type: "scraping-complete-for-review",
        data: analysisCache.scrapedData,
      });
    } else {
      throw new Error("The scraping script returned no results.");
    }
  } catch (error) {
    console.error("Error during scraping:", error);
    chrome.runtime.sendMessage({
      type: "analysis-error",
      error: error.message,
    });
  } finally {
    // CRITICAL: Ensure the temporary tab is always closed, even if errors occur.
    if (tempTabId) {
      await chrome.tabs.remove(tempTabId);
    }
  }
}

/**
 * Proceeds with the AI analysis after the user has reviewed the scraped data.
 */
async function proceedWithAI() {
  // Add checks to ensure cache is valid
  if (
    !analysisCache.prospect ||
    !analysisCache.scrapedData ||
    !analysisCache.settings
  ) {
    chrome.runtime.sendMessage({
      type: "analysis-error",
      error: "Analysis session expired or was invalid.",
    });
    return;
  }

  try {
    chrome.runtime.sendMessage({
      type: "analysis-status-update",
      status: "Analyzing with AI...",
    });

    const aiResult = await callGemini(
      analysisCache.scrapedData,
      analysisCache.settings // Pass the whole settings object now
    );
    // Create a new report object to be saved in the database
    const newReport = {
      ...analysisCache.prospect,
      ...aiResult, // Spread the results from the Gemini call (score, grade, etc.)
      analyzedAt: new Date(),
    };

    // Add the report to the 'reports' table and delete the original prospect
    const newReportId = await db.reports.add(newReport);
    await db.prospects.delete(analysisCache.prospect.id!);

    // Send a message to the popup that the analysis is complete
    chrome.runtime.sendMessage({
      type: "analysis-complete",
      reportId: newReportId,
    });
  } catch (error) {
    console.error("Error during AI analysis:", error);
    chrome.runtime.sendMessage({
      type: "analysis-error",
      error: error.message,
    });
  }
}
