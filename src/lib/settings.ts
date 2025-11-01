// Defines the structure for our settings and provides functions to save/load them.

export interface UserProfile {
  title: string;
  industry: string;
  skills: string; // A comma-separated string of skills
}

export interface AppSettings {
  userProfile: UserProfile;
  geminiApiKey: string;
  analysisGoal:
    | "Peer Networking"
    | "Target Audience (Clients)"
    | "Industry Leaders";
}

// Define the default state for a new user
const DEFAULT_SETTINGS: AppSettings = {
  userProfile: {
    title: "",
    industry: "",
    skills: "",
  },
  geminiApiKey: "",
  analysisGoal: "Target Audience (Clients)", // Set a default
};

/**
 * Loads settings from chrome.storage.local.
 * Returns default settings if none are found.
 */
export async function loadSettings(): Promise<AppSettings> {
  const data = await chrome.storage.local.get("appSettings");
  if (data.appSettings) {
    return data.appSettings;
  }
  return DEFAULT_SETTINGS;
}

/**
 * Saves settings to chrome.storage.local.
 * @param settings The settings object to save.
 */
export async function saveSettings(settings: AppSettings): Promise<void> {
  await chrome.storage.local.set({ appSettings: settings });
}
