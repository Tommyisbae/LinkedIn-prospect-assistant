import { useState, useEffect } from "react";
import type { AppSettings } from "../lib/settings";

interface SettingsPageProps {
  initialSettings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onBack: () => void;
}

export function SettingsPage({
  initialSettings,
  onSave,
  onBack,
}: SettingsPageProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSave = () => {
    onSave(settings);
    // Show a confirmation message instead of an alert
    setShowSavedMessage(true);
  };

  // Hide the "Saved!" message and go back after a short delay
  useEffect(() => {
    if (showSavedMessage) {
      const timer = setTimeout(() => {
        setShowSavedMessage(false);
        onBack(); // Go back after the message has been seen
      }, 1500); // Wait 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [showSavedMessage, onBack]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement // <-- THE FIX: Added HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested userProfile object
    if (name in settings.userProfile) {
      setSettings((prev) => ({
        ...prev,
        userProfile: { ...prev.userProfile, [name]: value },
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-4 h-full flex flex-col relative">
      {/* Non-blocking "Saved!" message */}
      {showSavedMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg z-20">
          Settings saved!
        </div>
      )}

      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-slate-300 hover:text-white">
          &larr; Back
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="w-12"></div> {/* Spacer */}
      </header>

      <main className="flex-grow space-y-6 overflow-y-auto pr-2">
        <section>
          <h2 className="text-lg font-semibold mb-2">My Profile</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300"
              >
                Job Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={settings.userProfile.title}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-slate-300"
              >
                Industry
              </label>
              <input
                type="text"
                name="industry"
                id="industry"
                value={settings.userProfile.industry}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-slate-300"
              >
                Key Skills / Services (comma-separated)
              </label>
              <textarea
                name="skills"
                id="skills"
                rows={3}
                value={settings.userProfile.skills}
                onChange={handleChange}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">Analysis Goal</h2>
          <div>
            <label
              htmlFor="analysisGoal"
              className="block text-sm font-medium text-slate-300"
            >
              Default Template
            </label>
            <select
              name="analysisGoal"
              id="analysisGoal"
              value={settings.analysisGoal}
              onChange={handleChange} // This will now work without a TS error
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Target Audience (Clients)</option>
              <option>Peer Networking</option>
              <option>Industry Leaders</option>
            </select>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">API Configuration</h2>
          <div>
            <label
              htmlFor="geminiApiKey"
              className="block text-sm font-medium text-slate-300"
            >
              Gemini API Key
            </label>
            <input
              type="password"
              name="geminiApiKey"
              id="geminiApiKey"
              value={settings.geminiApiKey}
              onChange={handleChange}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </section>
      </main>

      <footer className="mt-4">
        <button
          onClick={handleSave}
          disabled={showSavedMessage} // Disable button while saving
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
        >
          {showSavedMessage ? "Saving..." : "Save Settings"}
        </button>
      </footer>
    </div>
  );
}
