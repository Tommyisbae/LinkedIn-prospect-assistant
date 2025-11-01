// src/lib/gemini.ts

import {
  GoogleGenerativeAI,
  // These are not used in this configuration, but can be added back if needed
  // HarmCategory,
  // HarmBlockThreshold,
} from "@google/generative-ai";
// CORRECTED: 'AppSettings' is a type and must be imported this way.
import type { AppSettings } from "./settings";

// --- 1. DEFINE THE SHAPES OF OUR DATA ---

// This describes the raw JSON object we expect back from the AI
interface AIResponse {
  score_components: {
    role_fit: number; // Score 0-10
    skill_overlap: number; // Score 0-10
    seniority_match: number; // Score 0-10
  };
  justification: string;
  connection_message: string;
}

// This describes the final, processed result the function will return
interface GeminiAnalysisResult {
  score: number;
  justification: string;
  connectionMessage: string;
}

export async function callGemini(
  scrapedData: any, // The raw scraped data from the profile
  settings: AppSettings
): Promise<GeminiAnalysisResult> {
  // --- 2. CORRECTED RETURN TYPE ---
  const { geminiApiKey, userProfile, analysisGoal } = settings;

  if (!geminiApiKey) {
    throw new Error("Gemini API Key is not configured in settings.");
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);

  // --- 3. CORRECTED API CALL ---
  // Use the standard .getGenerativeModel() method
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
    CONTEXT: You are an expert networking and recruitment analyst. Your task is to evaluate a prospect's LinkedIn profile for a user based on a specific networking goal.

    USER'S PROFILE:
    - Title: ${userProfile.title}
    - Industry: ${userProfile.industry}
    - Skills/Services: ${userProfile.skills}

    PROSPECT'S PROFILE DATA (JSON):
    ${JSON.stringify(scrapedData, null, 2)}

    NETWORKING GOAL: "${analysisGoal}"

    TASK:
    Analyze the prospect's profile in relation to the user's profile and goal. Return ONLY a single valid JSON object with the following keys:
    - "score_components": An object with three numerical scores from 0 (not relevant) to 10 (perfectly relevant): "role_fit", "skill_overlap", and "seniority_match".
    - "justification": A concise, one-sentence explanation for your analysis.
    - "connection_message": A personalized, professional, and concise (under 300 characters) connection request message. It MUST reference a specific detail from the prospect's 'About', 'Experience', or 'Activity' sections.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // JSON mode is now configured here in generationConfig
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    const aiResult: AIResponse = JSON.parse(responseText);

    // --- YOUR SCORING LOGIC (UNCHANGED) ---
    let finalScore = 0;
    const { role_fit, skill_overlap, seniority_match } =
      aiResult.score_components;

    // These weights are arbitrary but a good starting point for customization.
    const weights = {
      "Peer Networking": { role: 5, skill: 4, seniority: 3, max: 120 },
      "Target Audience (Clients)": {
        role: 6,
        skill: 2,
        seniority: 4,
        max: 120,
      },
      "Industry Leaders": { role: 3, skill: 2, seniority: 7, max: 120 },
    };

    const currentWeights = weights[analysisGoal] || weights["Peer Networking"];
    finalScore =
      role_fit * currentWeights.role +
      skill_overlap * currentWeights.skill +
      seniority_match * currentWeights.seniority;

    const normalizedScore = Math.round((finalScore / currentWeights.max) * 500);

    const prospectFirstName = scrapedData.name?.split(" ")[0] || "there";

    return {
      score: Math.min(500, Math.max(0, normalizedScore)),
      justification: aiResult.justification,
      // Use a more robust replacement for the prospect's name
      connectionMessage: aiResult.connection_message.replace(
        /\[Prospect Name\]/gi,
        prospectFirstName
      ),
    };
  } catch (error) {
    console.error("Failed during Gemini call or JSON parsing:", error);
    // You can inspect the 'error' object here for more details from the API
    throw new Error(
      "AI analysis failed. The model may have returned an invalid response."
    );
  }
}
