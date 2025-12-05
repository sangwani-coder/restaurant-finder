import { toQueryString, parseGenAIResponse } from "./utils";
import { jest, beforeEach, describe, test, expect } from "@jest/globals";


describe('Object convertion to uri string', () => {

    test('Should convert 1 JSON object to UrlSearchParam', () => {
        const jsonObj = { 'location': 'Lusaka' };
        const res = toQueryString(jsonObj);
        expect(res).toBe('?location=Lusaka');
    })

    test('Should convert multiple parameters to UrlSearchParam', () => {
        const jsonObjs = { 'location': 'Lusaka', "rating": 4, "open_now": true };
        const res = toQueryString(jsonObjs);
        expect(res).toBe('?location=Lusaka&rating=4&open_now=true');
    })

    test('Should Handle empty objects correctly', () => {
        const jsonObjs = { };
        const res = toQueryString(jsonObjs);
        expect(res).toBe("");
    })

    test('Should Handle undefined objects correclty', () => {
        const jsonObjs = { undefined };
        const res = toQueryString(jsonObjs);
        expect(res).toBe("");
    })
})