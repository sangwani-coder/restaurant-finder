import { GoogleGenAI, Type } from "@google/genai";
import { initializeConfig } from '../config/config';
import { GenerateContentResponse } from "@google/genai";
import { toQueryString } from "../utils/utils";
import dotenv from 'dotenv';
dotenv.config();

// Configure the client
const config = initializeConfig();
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

/**
 * Find optimal restaurants for a user
 * @param string {query} - A string that provides query parameters.
 */
export async function findOptimalRestaurants(query: any, userLocation:any) {
  // Implement function in Utils to encode query params
  const parsed_query = toQueryString(query);
  let url:string | null = null;
  console.log(`Passed location 2-> ${userLocation}`);
  if (userLocation){
    url = `https://places-api.foursquare.com/places/search${parsed_query}&ll=userLocation`;
  } else{
    url = `https://places-api.foursquare.com/places/search${parsed_query}`;
  }
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json', 'X-Places-Api-Version': '2025-06-17',
      authorization: `Bearer ${config.FSQ_API_KEY}`,
    },
  };
  try {
    console.log('URL', url);
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const constraints = `
    Convert prompt into structured JSON command, Valid parameter fields are query, name,
    taste label, chain name, tip, telephone number.

    If the filter/parameter is not available proceed with available filters.
  `

// Function calling reference: https://ai.google.dev/gemini-api/docs/function-calling?example=weather#javascript
// Define the function declaration for the model
const restaurantFunctionDeclaration = {
  name: 'find_optimal_restaurants',
  description: 'Query the Foursquare Places API to find optimal places that match query paramaters',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: 'The city name, e.g. Kitwe',
      },
      name: {
        type: Type.STRING,
        description: 'The name of the restaurant, e.g Elephant cafe',
      },
      rating: {
        type: Type.STRING,
        description: 'The restaurants rating, e.g. 4',
      },
      chains: {
        type: Type.STRING,
        description: '',
      },
      tip: {
        type: Type.STRING,
        description: '',
      },
      telephone: {
        type: Type.STRING,
        description: 'The restaurants telephone number, e.g. 4',
      },
      open_now: {
        type: Type.BOOLEAN,
        description: 'Checks if a restaturant is open',
      }
    },
    // required: ['location'],
  },
};


/**
 * Parses user prompt into valid JSON, queries FSQ API with the result and filters response for the
 * user.
 * @param (string) userPrompt - A string from message query paramter
 * @returns The filtered JSON object from Google Gen AI
 */
export async function runUserPrompt(userPrompt: string, userLocation:any): Promise<string | any> {
  const systemPrompt = constraints + userPrompt;
  console.log(`Passed location-> ${userLocation}`);
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    }
  ];
  const config = {
    tools: [{
      functionDeclarations: [restaurantFunctionDeclaration]
    }],
  }
  // Send request with function declrations
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: config,
  });

  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    const tool_call = response.functionCalls[0];
    let functionResponse;
    if (tool_call?.name === 'find_optimal_restaurants' && tool_call.args) {
      functionResponse = await findOptimalRestaurants(tool_call.args, userLocation);
    }
    const NewConstraint = `Your task is to Use the function response from Foursquare Places API. 
                    and return new JSON objects with detailed restaurant information.
                    
                    **DO NOT include any explanation or markdown formatting (e.g., \`\`\`json).**
                    Return only the raw JSON object.
                    
                    **Required fields are name, address, detail_url. Include these other fields(optional)
                    if available e.g( Cuisine, Rating, Price Level Operating Hours**

                    Here is the data structure you must follow:
                    { "action": "restaurant_search", "results": [...] }
                    
                    Use this endpoint for each restaurants detail_url:
                    https://places-api.foursquare.com/places/{fsq_place_id}
                  If result is undefined or you fail to find the optmial restaurant return:
                  { "action": "restaurant_search", "results": [] }
                  .
                    `
    // Send back function result to model for final result
    const finalPrompt = NewConstraint + userPrompt;
    const newContents = [
      {
        role: 'user',
        parts: [{ text: finalPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: JSON.stringify(functionResponse) }],
      },
    ];

    const final_response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: newContents,
    });
    return final_response.text;
  } else {
    return response.text;
  }
}


// const prompt = `Find me all the restuarants near lusaka with africa in name or food`;
// const res = runUserPrompt(prompt);
// console.log('Test results', res);