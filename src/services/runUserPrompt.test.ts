import { jest, describe, test, beforeEach, expect } from "@jest/globals";
import { findOptimalRestaurants } from './runUserPrompt';
import fetchMock from 'jest-fetch-mock';

// Tell jets to use mocked version of config module
// import the mocked function
jest.mock('../config/config');
import { mockConfigValue } from '../config/__mocks__/config';


interface QueryParams extends Record<string, any> {
    location?: string;
    cuisine?: string;
    limit?: number;
}

// Mock the utility function to control the URL easily
jest.mock('../utils/utils', () => ({
    toQueryString: jest.fn((query: QueryParams) => {
        // Basic implementation for testing
        if (query.location) return `?location=${query.location}`;
        return '';
    }),
}));


describe('findOptimalRestaurants', () => {

    // Reset the mock state before each test
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    test('should successfully fetch and return restaurant data', async () => {
        const mockData = {
            action: 'restaurant_search',
            results: [{ name: 'Test Diner' }],
        };

        fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

        const query = { location: 'Lusaka' };
        const result = await findOptimalRestaurants(query);

        // Check that the correct URL was called
        expect(fetchMock).toHaveBeenCalledWith(
            'https://places-api.foursquare.com/places/search?location=Lusaka',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    accept: 'application/json', 'X-Places-Api-Version': '2025-06-17',
                    authorization: `Bearer ${mockConfigValue.FSQ_API_KEY}`,
                }),
            })
        );

        // Check that the function returned the parsed mock data
        expect(result).toEqual(mockData);
    });

    // HTTP Error Handling ---
    test('should throw an error on non-ok HTTP status', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Mock the fetch response for an error (status 403 Forbidden)
        fetchMock.mockResponseOnce('Forbidden', { status: 403, statusText: 'Forbidden' });

        const query = { location: 'Invalid' };
        const result = await findOptimalRestaurants(query);

        // The function catches the thrown error and returns undefined
        // (because it doesn't re-throw)
        expect(result).toBeUndefined();

        // Check that an error was logged to the console
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error fetching data:",
            new Error("HTTP error! status: 403")
        );

        consoleErrorSpy.mockRestore(); // Clean up the spy
    });

    test('should handle network errors (e.g., DNS failure)', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const mockError = new Error('Network request failed');
        fetchMock.mockReject(mockError);

        const query = { location: 'Offline' };
        const result = await findOptimalRestaurants(query);

        expect(result).toBeUndefined();

        // Check that the network error was logged
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error fetching data:",
            mockError
        );

        consoleErrorSpy.mockRestore(); // Clean up the spy
    });
});