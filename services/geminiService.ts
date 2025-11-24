import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { TravelGuideData, GroundingChunk, TravelPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the main guide generation
const GUIDE_SYSTEM_INSTRUCTION = `
You are an expert travel guide for Bangladesh. 
When asked about a location, provide a comprehensive structured guide in Markdown format.
Focus on:
1. **Overview**: Brief engaging summary.
2. **Getting There**: Modes of transport (Bus, Train, Air) from Dhaka, costs in BDT, and duration.
3. **Where to Stay**: Recommended areas and price ranges (Budget, Mid-range, Luxury).
4. **Best Foods**: Specific local dishes to try and famous restaurants.
5. **Safety & Scams**: Specific warnings for tourists, common scams, and safety level.
6. **Dos and Don'ts**: Cultural norms.
7. **Best Time to Visit**: Weather and season advice.
8. **Budget**: Estimated daily cost.

Use bold headers (##). Keep the tone helpful, safe, and informative.
`;

export const fetchDestinationGuide = async (location: string): Promise<TravelGuideData> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed travel guide for ${location}, Bangladesh. Include specific details about current transport costs and safety situation.`,
      config: {
        systemInstruction: GUIDE_SYSTEM_INSTRUCTION,
        tools: [
            { googleMaps: {} }, 
            { googleSearch: {} }
        ],
        temperature: 0.4,
      },
    });

    const text = response.text || "Sorry, I couldn't generate a guide for this location.";
    
    // Extract grounding chunks if available
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];

    return {
      locationName: location,
      content: text,
      groundingChunks: groundingChunks
    };

  } catch (error) {
    console.error("Error fetching destination guide:", error);
    throw new Error("Failed to load travel guide. Please check your connection or API key.");
  }
};

export const fetchTravelRecommendation = async (prefs: TravelPreferences): Promise<TravelGuideData> => {
  try {
    const prompt = `
      User Preferences:
      - Budget: ${prefs.budget}
      - Mood: ${prefs.mood}
      - Duration: ${prefs.duration} days
      - Favorite Activities: ${prefs.activities}

      Task:
      1. Analyze different travel destinations in Bangladesh that fit these criteria.
      2. Compare the top 2-3 options briefly in your mind (thinking).
      3. Select the SINGLE BEST destination (or a combined itinerary if close by) that matches perfectly.
      4. Create a detailed recommendation response in Markdown.
      
      Response Structure:
      - **Top Pick**: The Name of the Place.
      - **Why This Choice**: Explain why it fits their mood, budget, and activities.
      - **Suggested Itinerary**: A day-by-day breakdown for ${prefs.duration} days.
      - **Estimated Cost Breakdown**: Transport, Food, Accommodation totals.
      - **Pro Tips**: Specific advice for this trip.
      
      Use the thinking model to ensure the recommendation is logically sound and the itinerary is realistic.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an intelligent travel planner for Bangladesh. Suggest the best possible trip based on user constraints.",
        thinkingConfig: {
          thinkingBudget: 32768,
        },
        tools: [
          { googleSearch: {} }
        ],
      }
    });

    const text = response.text || "I couldn't find a perfect match, but I recommend exploring Cox's Bazar or Sylhet as general safe options.";
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];

    return {
      locationName: "Your Personalized Trip Plan",
      content: text,
      groundingChunks: groundingChunks
    };
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    throw new Error("Failed to generate a travel plan. Please try again.");
  }
};

export const createChatSession = (): Chat => {
  // Using gemini-3-pro-preview with thinking for complex reasoning in chat
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are a helpful travel assistant for Bangladesh. You are knowledgeable about routes, safety, costs, and culture. Think deeply before answering complex queries about itineraries or safety.",
      thinkingConfig: {
        thinkingBudget: 32768, 
      }
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I didn't quite catch that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I'm having trouble connecting right now.";
  }
};