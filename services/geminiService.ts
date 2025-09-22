// Fix: Replaced mock service with a real implementation using @google/genai.
import { GoogleGenAI } from "@google/genai";

// This service uses the @google/genai package to make a real API call to the Gemini API.
// The API key is sourced from the `process.env.API_KEY` environment variable.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEmailContent = async (prompt: string): Promise<string> => {
  console.log("Calling Gemini API with prompt:", prompt);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return a fallback message in case of an error
    return "Sorry, I couldn't generate a response right now. Please try again later.";
  }
};
