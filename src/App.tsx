import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./lib/db";
import { type AppSettings, loadSettings, saveSettings } from "./lib/settings";
import { SettingsPage } from "./components/SettingsPage";
import { AnalysisInProgress } from "./components/AnalysisInProgress";
import { AnalysisReport } from "./components/AnalysisReport";
import { HistoryView } from "./components/HistoryView";
import { ScrapeReview } from "./components/ScrapeReview";
import type { Prospect } from "./lib/db";

type View =
  | "prospects"
  | "settings"
  | "history"
  | "analyzing"
  | "report"
  | "reviewingScrape";

type ProspectViewProps = {
  onGoToSettings: () => void;
  onGoToHistory: () => void;
  onAnalyze: (prospect: Prospect) => void;
};

/**
 * Main view for displaying prospects and capture actions.
 */
function ProspectView({
  onGoToSettings,
  onGoToHistory,
  onAnalyze,
}: ProspectViewProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState("");

  const prospects = useLiveQuery(() =>
    db.prospects.orderBy("createdAt").reverse().toArray()
  );

  // CORRECTED and UNIFIED handleCaptureProfiles function
  const handleCaptureProfiles = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;

    setIsScraping(true);
    setError("");
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content-scripts/profileScraper.js"],
      });

      const scrapedProspects = results?.[0]?.result as Prospect[];
      if (scrapedProspects?.length) {
        // --- DE-DUPLICATION LOGIC ---
        const existingUrls = new Set(prospects?.map((p) => p.profileUrl) || []);
        const newProspects = scrapedProspects.filter(
          (p) => !existingUrls.has(p.profileUrl)
        );
        // --- END DE-DUPLICATION LOGIC ---

        if (newProspects.length > 0) {
          await db.prospects.bulkAdd(
            newProspects.map((p) => ({ ...p, createdAt: new Date() }))
          );
        }

        const duplicateCount = scrapedProspects.length - newProspects.length;
        alert(
          `${newProspects.length} new prospects added.\n(${duplicateCount} duplicates were ignored)`
        );
      } else {
        setError("No profiles found on the page.");
      }
    } catch (err) {
      console.error("Profile scraping failed:", err);
      setError("Failed to capture profiles from search.");
    } finally {
      setIsScraping(false);
    }
  };

  // CORRECTED and UNIFIED handleCaptureCommenters function
  const handleCaptureCommenters = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) return;

    setIsScraping(true);
    setError("");
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["src/content-scripts/commentScraper.js"],
      });

      const scrapedProspects = results?.[0]?.result as Prospect[];
      if (scrapedProspects?.length) {
        // --- DE-DUPLICATION LOGIC ---
        const existingUrls = new Set(prospects?.map((p) => p.profileUrl) || []);
        const newProspects = scrapedProspects.filter(
          (p) => !existingUrls.has(p.profileUrl)
        );
        // --- END DE-DUPLICATION LOGIC ---

        if (newProspects.length > 0) {
          await db.prospects.bulkAdd(
            newProspects.map((p) => ({ ...p, createdAt: new Date() }))
          );
        }

        const duplicateCount = scrapedProspects.length - newProspects.length;
        alert(
          `${newProspects.length} new prospects added.\n(${duplicateCount} duplicates were ignored)`
        );
      } else {
        setError("No commenters found. Make sure comments are loaded.");
      }
    } catch (err) {
      console.error("Comment scraping failed:", err);
      setError("Failed to capture commenters.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleClearProspects = async () => {
    if (window.confirm("Are you sure you want to delete all prospects?")) {
      await db.prospects.clear();
    }
  };

  return (
    <div className="bg-slate-800 text-white min-h-full p-4 font-sans flex flex-col h-full">
      <header className="flex items-center justify-between text-center mb-4">
        <div className="w-8"></div>
        <div>
          <h1 className="text-xl font-bold">LinkedIn Prospect Assistant</h1>
          <p className="text-sm text-slate-400">v0.9.0 - De-duplication</p>
        </div>
        <button
          onClick={onGoToSettings}
          title="Settings"
          className="text-2xl hover:text-slate-300 w-8"
        >
          ⚙️
        </button>
      </header>

      <main className="flex-grow flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2">
          <button
            onClick={handleCaptureProfiles}
            disabled={isScraping}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            title="Capture profiles from a LinkedIn search results page"
          >
            {isScraping ? "..." : "Capture (Search)"}
          </button>
          <button
            onClick={handleCaptureCommenters}
            disabled={isScraping}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded"
            title="Capture profiles from the comments section of a LinkedIn post"
          >
            {isScraping ? "..." : "Capture (Comments)"}
          </button>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={onGoToHistory}
            className="text-sm text-blue-400 hover:underline"
          >
            View Analysis History
          </button>
          <button
            onClick={handleClearProspects}
            className="bg-red-800 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded text-xs"
            title="Clear all prospects"
          >
            Clear All
          </button>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div className="flex-grow overflow-y-auto pr-2">
          {prospects?.length ? (
            <ul className="space-y-3">
              {prospects.map((prospect) => (
                <li
                  key={prospect.id}
                  onClick={() => onAnalyze(prospect)}
                  className="bg-slate-700 p-3 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="font-bold text-base">{prospect.name}</p>
                    {prospect.connectionDegree && (
                      <span className="text-xs font-semibold bg-slate-600 px-2 py-0.5 rounded-full">
                        {prospect.connectionDegree}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm">{prospect.headline}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-slate-400 mt-10">
              <p>No prospects captured.</p>
              <p className="text-xs mt-2">
                Use the Capture buttons on a LinkedIn page.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Main App component, acts as a view controller. (UNCHANGED)
 */
function App() {
  const [view, setView] = useState<View>("prospects");
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentItem, setCurrentItem] = useState<{
    prospect?: Prospect;
    reportId?: number;
    scrapedData?: any;
  }>({});
  const [analysisStatus, setAnalysisStatus] = useState("Initiating...");

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  useEffect(() => {
    const messageListener = (message: any) => {
      console.log("Received message:", message);
      if (message.type === "analysis-status-update") {
        setAnalysisStatus(message.status);
      } else if (message.type === "scraping-complete-for-review") {
        setCurrentItem((prev) => ({ ...prev, scrapedData: message.data }));
        setView("reviewingScrape");
      } else if (message.type === "analysis-complete") {
        setCurrentItem((prev) => ({ ...prev, reportId: message.reportId }));
        setView("report");
      } else if (message.type === "analysis-error") {
        alert(`An error occurred: ${message.error}`);
        setView("prospects");
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  const handleStartAnalysis = (prospect: Prospect) => {
    setCurrentItem({ prospect });
    setView("analyzing");
    setAnalysisStatus("Sending request to background service...");
    chrome.runtime.sendMessage({
      type: "analyze-single-prospect",
      data: { prospect, settings },
    });
  };

  const handleProceedWithAI = () => {
    setView("analyzing");
    setAnalysisStatus("Requesting AI analysis...");
    chrome.runtime.sendMessage({ type: "proceed-with-ai-analysis" });
  };

  const handleCancel = () => {
    setView("prospects");
  };

  const handleSaveSettings = async (newSettings: AppSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
    setView("prospects");
  };

  const renderContent = () => {
    if (!settings) {
      return (
        <div className="h-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }
    switch (view) {
      case "settings":
        return (
          <SettingsPage
            initialSettings={settings}
            onSave={handleSaveSettings}
            onBack={() => setView("prospects")}
          />
        );
      case "history":
        return (
          <HistoryView
            onBack={() => setView("prospects")}
            onViewReport={(id) => {
              setCurrentItem({ reportId: id });
              setView("report");
            }}
          />
        );
      case "analyzing":
        return (
          <AnalysisInProgress
            prospectName={currentItem.prospect?.name || "..."}
            statusMessage={analysisStatus}
          />
        );
      case "reviewingScrape":
        return (
          <ScrapeReview
            prospectName={currentItem.prospect?.name || "..."}
            scrapedData={currentItem.scrapedData}
            onProceed={handleProceedWithAI}
            onCancel={handleCancel}
          />
        );
      case "report":
        return (
          <AnalysisReport
            reportId={currentItem.reportId!}
            onBack={() => setView("history")}
          />
        );
      case "prospects":
      default:
        return (
          <ProspectView
            onGoToSettings={() => setView("settings")}
            onGoToHistory={() => setView("history")}
            onAnalyze={handleStartAnalysis}
          />
        );
    }
  };

  return (
    <div className="bg-slate-800 text-white min-h-full font-sans">
      {renderContent()}
    </div>
  );
}

export default App;
