import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { initializeConfig } from './config/config'; 
dotenv.config();


const config = initializeConfig()
const ai = new GoogleGenAI({apiKey: config.LLM_API_KEY});

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

const constraints: string = `
    Convert prompt into s structured JSON command, Valid fields are but not limited to
    location, name,
    taste label, chain name, tip, telephone number.
    Output similar to: 
        {
        "action": "restaurant_search".
        "parameters": {
            "query": "sushi",
            "near": "downtown Los Angeles",
            "price": "1", //optional
            "open_now": true // optional
        }
      }
  `
const userInput: string = 'Example input from example user';
async function main() {
  const prompt: string = constraints + userInput;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: 'application/json'
    }
  });
  console.log(response.text);
}

main();