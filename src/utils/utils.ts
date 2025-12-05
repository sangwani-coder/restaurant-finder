/**
 * Converts a parameter object into a URL query string, 
 * optionally prepending a '?' using @UrlSearchParams
 * Guide: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 * @param params The object containing the query parameters (e.g., {location: "Lusaka"})
 * 
 * @returns  A fully encoded query string (e.g., "?location=Lusaka")
 */
export function toQueryString(params: Record<string, string | number | boolean>): string {
    // convert params to JS Object
    // Use map to to transform params values to string
    const paramsObj = Object.entries(params)
        .map(([key, value]) => [key, String(value)]);
    const searchParams = new URLSearchParams(paramsObj);
    const queryString = searchParams.toString();
    return `?${queryString}`;

}

// Test Usage
// 1. single paramter
const params1 = { location: "Lusaka" };
console.log(toQueryString(params1)); 

// 2. Multiple parameters
const params2 = {name:"Lusaka Restaurant", location: "Lusaka", rating: 5, open_now: true };
console.log(toQueryString(params2)); 