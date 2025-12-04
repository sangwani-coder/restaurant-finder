import { expect, jest, test, describe, beforeEach, it } from '@jest/globals';
import { promptAi } from "./parsePrompt";
import { GoogleGenAI } from "@google/genai";

jest.mock("@google/genai");

describe("promptAi()", () => {
  it("Mocks generate content successfully", async () => {
    const mockGenerateContent = jest.fn(()=>'Mocked value');
    const mockModels = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });

    (GoogleGenAI as unknown as jest.Mock).mockImplementation(() => ({
      models: mockModels,
    }));

    const result = await promptAi("hello");

    // Assertions
    expect(mockGenerateContent).toHaveBeenCalled();
    expect(result).toBe('{"ok": true}');
  });
});
