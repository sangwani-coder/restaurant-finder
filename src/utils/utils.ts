interface Restaurant {
  name: string;
  address: string;
  detail_url: string;
  Cuisine: string;
}

interface RestaurantResponse {
  action: string;
  results: Restaurant[];
}

/**
 * Attempts to parse a string response into a typed JSON object.
 * @param jsonString The raw string output from the Google Gen AI model.
 * @returns The parsed JSON object, or null if parsing fails.
 */
export function parseGenAIResponse(jsonString: string): RestaurantResponse | null {
  try {
    // Check if the string is valid before parsing
    if (!jsonString || jsonString.trim() === '') {
      return null;
    }
    // Attempt to parse the string into a JavaScript object
    const jsonObject: RestaurantResponse = JSON.parse(jsonString);

    // Basic runtime check to confirm the structure
    if (
      typeof jsonObject === 'object' &&
      jsonObject !== null &&
      Array.isArray(jsonObject.results)
    ) {
      return jsonObject;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}


/**
 * Converts a parameter object into a URL query string and prepends a '?'.
 * 
 * @URLSearchParams
 * Guide: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 * @param params The object containing the query parameters (e.g., {location: "Lusaka"})
 * @returns  A fully encoded query string (e.g., "?location=Lusaka")
 */
export function toQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  // convert params to JS Object use to handle null/undefined/empty string values 
  // ans ensure all values are strings respectively.
  const paramsObj = Object.entries(params)
    .filter(([key, value]) => value !== undefined && value !== null && String(value) !== '')
    .map(([key, value]) => [key, String(value)]);
  // Construct new obj
  const searchParams = new URLSearchParams(paramsObj);
  // Get the string suitable for use in a URL.
  const queryString = searchParams.toString();

  // Prepend ? if the string is not empty.
  if (queryString.length > 0) {
    return `?${queryString}`;
  }
  return queryString
}