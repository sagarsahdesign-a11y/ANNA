import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { AnalysisResult, FreshnessLevel, VideoAnalysisResult } from "../types";
import { getFoodDatabasePrompt } from "../data/foodDatabase";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Image Analysis (Gemini 3 Pro) ---

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the food item detected" },
          confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
          estimatedWeightGrams: { type: Type.NUMBER, description: "Estimated weight in grams" },
          caloriesPer100g: { type: Type.NUMBER, description: "Caloric density" },
          totalCalories: { type: Type.NUMBER, description: "Calculated total calories for this portion" },
          freshness: { 
            type: Type.STRING, 
            enum: ["Fresh", "Acceptable", "Spoiled", "Unknown"],
            description: "Visual assessment of food quality"
          },
          freshnessScore: { type: Type.NUMBER, description: "0 (Rotten) to 1 (Peak Freshness)" },
          reasoning: { type: Type.STRING, description: "Brief explanation of the portion and freshness estimation" }
        },
        required: ["name", "confidence", "estimatedWeightGrams", "caloriesPer100g", "totalCalories", "freshness", "freshnessScore"]
      }
    },
    totalCalories: { type: Type.NUMBER, description: "Sum of all item calories" },
    summary: { type: Type.STRING, description: "A friendly, short summary of the meal." }
  },
  required: ["items", "totalCalories", "summary"]
};

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) return getMockAnalysis();

  try {
    // Upgraded to gemini-3-pro-preview for better image understanding
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          {
            text: `You are an expert nutritionist.
            Analyze this food image.

            REFERENCE NUTRITION DATABASE (Use these exact values if item matches):
            ${getFoodDatabasePrompt()}

            1. Identify all food items. Match with database items where possible.
            2. Estimate the portion size in grams. Assume a standard dinner plate (10-11 inches) or use reference objects like cutlery if visible.
            3. Calculate the total calories based on the kcal/g values from the database (multiply by 100 for caloriesPer100g). Formula: weight_in_grams * kcal_per_gram_from_database.
            4. Assess the freshness of the food visually. Look for signs of spoilage, wilting, or discoloration.
            5. Return the result in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Image Analysis Failed:", error);
    throw error;
  }
};

// --- Video Understanding (Gemini 3 Pro) ---

export const analyzeFoodVideo = async (base64Video: string, mimeType: string): Promise<VideoAnalysisResult> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Video } },
          { text: "Analyze this video of food. Identify the dish, estimate total calories shown, and list the main ingredients you see." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            items: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VideoAnalysisResult;
    }
    throw new Error("No response from Gemini");
  } catch (error) {
    console.error("Gemini Video Analysis Failed:", error);
    throw error;
  }
};

// --- Chat with Thinking Mode (Gemini 3 Pro) ---

export const chatWithChef = async (history: any[], newMessage: string) => {
  if (!process.env.API_KEY) return { text: "I'm a mock chef. (API Key missing)" };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: newMessage }] }],
      config: {
        // Thinking mode enabled with max budget
        thinkingConfig: { thinkingBudget: 32768 }, 
        systemInstruction: "You are a highly intelligent chef and nutritionist. Think deeply about complex nutritional questions."
      }
    });
    return { text: response.text || "No response" };
  } catch (error) {
    console.error("Chat Failed:", error);
    throw error;
  }
};

// --- Search Grounding (Gemini 3 Flash) ---

export const searchNutritionInfo = async (query: string) => {
  if (!process.env.API_KEY) return { text: "Search is unavailable without API Key.", groundingChunks: [] };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    // Extract grounding URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = chunks.map((c: any) => ({
      title: c.web?.title || "Source",
      uri: c.web?.uri || ""
    })).filter((u: any) => u.uri);

    return { text: response.text || "", groundingUrls: urls };
  } catch (error) {
    console.error("Search Failed:", error);
    throw error;
  }
};

// --- Maps Grounding (Gemini 2.5 Flash) ---

export const findNearbyPlaces = async (query: string, lat: number, lng: number) => {
  if (!process.env.API_KEY) return { text: "Maps unavailable without API Key.", groundingChunks: [] };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });

    // Extract Maps grounding URLs
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = chunks.map((c: any) => ({
      title: c.maps?.title || "Map Location",
      uri: c.maps?.uri || ""
    })).filter((u: any) => u.uri);

    return { text: response.text || "", groundingUrls: urls };
  } catch (error) {
    console.error("Maps Failed:", error);
    throw error;
  }
};

// --- Text to Speech (Gemini 2.5 Flash TTS) ---

export const generateSpeech = async (text: string) => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Failed:", error);
    return null;
  }
};

// Mock data
const getMockAnalysis = (): AnalysisResult => {
  return {
    items: [
      {
        name: "Grilled Salmon",
        confidence: 0.95,
        estimatedWeightGrams: 150,
        caloriesPer100g: 208,
        totalCalories: 312,
        freshness: FreshnessLevel.FRESH,
        freshnessScore: 0.9,
        reasoning: "Vibrant color, moist texture visible."
      },
      {
        name: "Steamed Broccoli",
        confidence: 0.98,
        estimatedWeightGrams: 80,
        caloriesPer100g: 34,
        totalCalories: 27,
        freshness: FreshnessLevel.ACCEPTABLE,
        freshnessScore: 0.7,
        reasoning: "Slight yellowing on florets."
      }
    ],
    totalCalories: 339,
    summary: "A healthy, protein-rich meal with fresh salmon and acceptable broccoli."
  };
};