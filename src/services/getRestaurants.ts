import dotenv from 'dotenv';
import { initializeConfig } from '../config/config';
dotenv.config();

const config = initializeConfig();

/**
 * Function to query for places in the FSQ Places database using a
 * location(default) and querying by name, category name,
 * telephone number, taste label, or chain name.
 * e.g search for "coffee" to get back a list of recommended coffee shops. 
 * 
 * @param query
 * String that provides optional filter options.
 * 
 * @example
 * const query =?name=example&address=kitwe&rating=4
 * 
 */
export async function getRestaurants(query: string | '') {
    const url = `https://places-api.foursquare.com/places/search${query}`;
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
