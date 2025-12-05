import { toQueryString, parseGenAIResponse } from "./utils";
import { jest, beforeEach, describe, test, expect } from "@jest/globals";


const isJSON = (str: string) => {
    try {
        const json = JSON.parse(str);
        if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
            return false
        }
    } catch (e) {
        return false
    }
    return true
}


describe('Parse a string response into a typed JSON object', () => {
    test('Should return valid JSON object', () => {
        const noneJsonObjs = String({ 'location': 'Lusaka', "rating": 4, "open_now": true });
        const res = parseGenAIResponse(noneJsonObjs);
        expect(typeof(res)).toBe("object");
        expect(res).not.toBeNull;
    });

    test('Should return null if empty string', () => {
        const noneJsonObjs = ' ';
        const res = parseGenAIResponse(noneJsonObjs);
        expect(res).not.toBeNull;
    });

    test('Should return valid JSON object if given JSON object', () => {
        const JsonObjs = JSON.stringify({ 'location': 'Lusaka', "rating": 4, "open_now": true });
        const res = parseGenAIResponse(JsonObjs);
        expect(typeof(res)).toBe("object");
        expect(res).not.toBeNull;
    });
});


describe('Object convertion to uri string', () => {

    test('Should convert 1 JSON object to UrlSearchParam', () => {
        const jsonObj = { 'location': 'Lusaka' };
        const res = toQueryString(jsonObj);
        expect(res).toBe('?location=Lusaka');
    });

    test('Should convert multiple parameters to UrlSearchParam', () => {
        const jsonObjs = { 'location': 'Lusaka', "rating": 4, "open_now": true };
        const res = toQueryString(jsonObjs);
        expect(res).toBe('?location=Lusaka&rating=4&open_now=true');
    });

    test('Should Handle empty objects correctly', () => {
        const jsonObjs = {};
        const res = toQueryString(jsonObjs);
        expect(res).toBe("");
    });

    test('Should Handle undefined objects correclty', () => {
        const jsonObjs = { undefined };
        const res = toQueryString(jsonObjs);
        expect(res).toBe("");
    });
});