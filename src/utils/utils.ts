/**
 * Converts a parameter object into a URL query string and
 * prepends a '?'.
 * @URLSearchParams
 * Guide: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 * @param params The object containing the query parameters (e.g., {location: "Lusaka"})
 * @returns  A fully encoded query string (e.g., "?location=Lusaka")
 */
export function toQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
    // convert params to JS Object
    // use filter to null/undefined/empty string values 
    // Use map to to transform params values to string
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