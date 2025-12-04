import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { initializeConfig } from '../config/config';
dotenv.config();


const config = initializeConfig()
const ai = new GoogleGenAI({ apiKey: config.LLM_API_KEY });

// Code Examples for text generation and structuring response as JSON:
// https://ai.google.dev/gemini-api/docs/text-generation
// https://ai.google.dev/gemini-api/docs/structured-output?example=recipe


/**
 * FQS Query strings
 * location(uses default if not set) place name, category name,
 * telephone number, taste label, or chain name. 
 * 
 * Prompting strategies:
 * https://ai.google.dev/gemini-api/docs/prompting-strategies
 */
const constraints = `
    Convert prompt into structured JSON command, Valid parameter fields are location, name,
    taste label, chain name, tip, telephone number.
    Output similar to: 
        {
        "action": "restaurant_search".
        "parameters": {
            "query": "sushi",
            "near": "downtown Los Angeles",
            "price": "1", //optional
            "open_now": true, // optional
            // ...other valid fields
        }
      }
  `

export async function promptAi(message: string | 'undefined'): Promise<string> {
    const prompt = constraints + message;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });
    return response.text!;
}