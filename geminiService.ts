import { GoogleGenAI, Type } from "@google/genai";
import { TravelPlan, TripFormData, GroundingSource } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTravelPlan = async (formData: TripFormData): Promise<TravelPlan> => {
  const { destination, duration, travelers, budget, currency, interests, includeHotelCharges, mustVisitPlaces } = formData;

  const budgetContext = includeHotelCharges 
    ? `The total budget of ${currency} ${budget.toLocaleString()} MUST include the cost of all accommodations/hotels for the entire stay.` 
    : `The total budget of ${currency} ${budget.toLocaleString()} is strictly for activities, local transport, and food. DO NOT include hotel/accommodation costs.`;

  const mustVisitContext = mustVisitPlaces 
    ? `The user has specified these MUST-VISIT locations: "${mustVisitPlaces}". You MUST include these in the itinerary and prioritize them, ensuring they fit within the allocated budget and travel logistics.` 
    : "";

  const prompt = `Create a highly personalized, detailed ${duration}-day travel itinerary for ${travelers} people visiting ${destination}. 
  ${budgetContext}
  User interests: ${interests.join(", ")}. 
  ${mustVisitContext}
  
  CRITICAL REAL-TIME TRANSPORT AND MAPPING REQUIREMENTS:
  1. Use Google Search to find ESTIMATED current Uber and Ola cab prices (or local equivalents like Grab/Lyft if appropriate for the destination) in ${destination}.
  2. For every activity (except the first one of the day), provide 'transportFromPrevious' which includes the estimated cost of a cab/transport between the previous location and this one.
  3. Include a category "Local Transport" in the budget breakdown that sums up these estimates.
  4. Provide precise latitude and longitude 'coordinates' as {lat: number, lng: number} for ALL activities and accommodations.
  
  CURRENCY AND COST REQUIREMENTS:
  1. ALL costs MUST be in ${currency}. Use the appropriate currency symbol.
  2. Use high-authority sources for entry fees.
  3. Ensure the 'totalEstimatedBudget' returned in the JSON is in ${currency}.

  STANDARD REQUIREMENTS:
  1. Provide a chronological timetable with 'timeSlot'.
  2. Return a JSON response following the specified schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          overview: { type: Type.STRING },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                theme: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      location: { type: Type.STRING },
                      timeSlot: { type: Type.STRING },
                      estimatedCost: { type: Type.STRING },
                      sourceUrl: { type: Type.STRING },
                      coordinates: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER }
                        },
                        required: ["lat", "lng"]
                      },
                      transportFromPrevious: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          estimatedCost: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          note: { type: Type.STRING }
                        },
                        required: ["type", "estimatedCost", "duration"]
                      }
                    },
                    required: ["name", "description", "estimatedCost", "timeSlot", "coordinates"]
                  }
                }
              },
              required: ["day", "activities"]
            }
          },
          accommodations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                priceRange: { type: Type.STRING },
                description: { type: Type.STRING },
                link: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  },
                  required: ["lat", "lng"]
                }
              },
              required: ["name", "type", "priceRange", "coordinates"]
            }
          },
          foodSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cuisine: { type: Type.STRING },
                specialty: { type: Type.STRING },
                description: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["name", "cuisine"]
            }
          },
          budgetBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                estimatedCost: { type: Type.NUMBER }
              },
              required: ["category", "estimatedCost"]
            }
          },
          totalEstimatedBudget: { type: Type.NUMBER },
          currency: { type: Type.STRING }
        },
        required: ["destination", "itinerary", "accommodations", "totalEstimatedBudget", "currency"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const webSources: GroundingSource[] = groundingChunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || 'External Source',
      uri: chunk.web?.uri || ''
    }))
    .filter(source => source.uri !== '');

  try {
    return {
      ...JSON.parse(text),
      sources: webSources
    } as TravelPlan;
  } catch (err) {
    console.error("Failed to parse AI response", text);
    throw new Error("Invalid response format from AI");
  }
};

export const generateMonumentArt = async (name: string, location: string): Promise<string | null> => {
  try {
    const prompt = `A clean, high-quality digital travel illustration of "${name}" in ${location}. Minimalist aesthetic, soft colors, sharp focus, professional travel guide style. White background.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating monument art:", error);
    return null;
  }
};