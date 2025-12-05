import { GoogleGenAI, Type } from "@google/genai";
import { initializeConfig } from '../config/config';
import { GenerateContentResponse } from "@google/genai";
import { toQueryString } from "../utils/utils";
import dotenv from 'dotenv';

dotenv.config();

// Configure the client
const config = initializeConfig()
const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

/**
 * Find optimal restaurants for a user
 * @param string {query} - A string that provides query parameters.
 */
export async function findOptimalRestaurants(query: any) {
  // Implement function in Utils to encode query params
  const parsed_query = toQueryString(query);
  const url = `https://places-api.foursquare.com/places/search${parsed_query}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json', 'X-Places-Api-Version': '2025-06-17',
      authorization: `Bearer ${config.FSQ_API_KEY}`,
    },
  };
  try {
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

// Function calling reference: https://ai.google.dev/gemini-api/docs/function-calling?example=weather#javascript
// Define the function declaration for the model
const restaurantFunctionDeclaration = {
  name: 'find_optimal_restaurants',
  description: 'Finds restaurants that suits the users description.',
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
    },
    // required: ['location'],
  },
};

async function runUserRequest(userPrompt: string): Promise<void> {
  const systemPrompt = constraints + userPrompt;
  const contents = [
    {
      role: 'user',
      parts: [{ text: userPrompt }]
    }
  ];
  // Send request with function declrations
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      tools: [{
        functionDeclarations: [restaurantFunctionDeclaration]
      }],
    },
  });

  console.log(`First Response ${response.text}`);

  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    const tool_call = response.functionCalls[0]; // Assuming one function call
    let functionResponse;
    if (tool_call?.name === 'find_optimal_restaurants' && tool_call.args) {
      functionResponse = await findOptimalRestaurants(tool_call.args);
      console.log(`Function execution result: ${JSON.stringify(functionResponse)}`);
    }
    const NewConstraint = `Use the function response from Foursquare Places API. 
                    and return new JSON objects with detailed restaurant information including:
                    Name
                    Address
                    Cuisine
                    Rating (optional)
                    Price Level (optional)
                    Operating Hours (optional)
                    detail_url
                    The Detail url is:https://places-api.foursquare.com/places/{fsq_place_id}
                    `
    // Send back function result to model for final result
    if (response && 'candidates' in response) {
      console.log('Candidates:', response.candidates[0]);
      const finalPrompt = NewConstraint + userPrompt;
      const newContents = [
        {
          role: 'user',
          parts: [{ text: finalPrompt }]
        },
        // { role: "model", parts: [response.candidates[0]?.content] },
        {
          role: 'model',
          parts: [{ text: JSON.stringify(functionResponse) }],
        },
      ];
      console.log('New Prompt', newContents);
      // Get the final response from the model
      const final_response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: newContents,
      });
      console.log('Finall response');
      console.log(final_response.text?.trim());
    }

  } else {
    console.log("No function call found in the response.");
    console.log(response.text);
  }
}


// Dev Tests
const userPrompt = `
Find me a cheap sushi restaurant in downtown Los Angeles that's open now and has at 
least a 4-star rating.`
runUserRequest(userPrompt);