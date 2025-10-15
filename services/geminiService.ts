// FIX: Implement Gemini API service functions.
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { VocabularyWord, AlternateMeaning, ExploredWordInfo, SimpleDefinition } from '../types';

// FIX: Initialize the GoogleGenAI client. The API key must be provided via the `process.env.API_KEY` environment variable.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});


export const parseVocabulary = async (): Promise<VocabularyWord[]> => {
  // Dynamically import the vocabulary list to code-split this large data file.
  const { vocabularyList } = await import('../data/vocabularyList');
  return vocabularyList;
};

// FIX: Implement getMoreExamples to fetch additional sentences for a word.
export const getMoreExamples = async (word: string, definition: string): Promise<string[]> => {
  const prompt = `Given the word "${word}" which means "${definition}", provide 3 more distinct example sentences. Return a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

// FIX: Implement getMoreMeanings to fetch alternate definitions for a word.
export const getMoreMeanings = async (word: string): Promise<AlternateMeaning[]> => {
  const prompt = `Provide other common meanings for the word "${word}", excluding the most common one. For each meaning, provide its part of speech and definition. Return a JSON array of objects, where each object has "partOfSpeech" and "definition" keys. If there are no other common meanings, return an empty array.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            partOfSpeech: { type: Type.STRING },
            definition: { type: Type.STRING },
          },
          required: ['partOfSpeech', 'definition'],
        },
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

// FIX: Implement exploreWord to get detailed information about a word.
export const exploreWord = async (word: VocabularyWord): Promise<ExploredWordInfo> => {
  const prompt = `Explore the word "${word.word}". The primary definition is "${word.definition}" (${word.partOfSpeech}). 
  Provide the following in a JSON object:
  1. "alternateMeanings": An array of other common meanings. Each object should have "partOfSpeech" and "definition".
  2. "relatableSentences": An array of 3 example sentences that are easy for a young adult to understand.
  3. "engineeringSentence": One example sentence of how this word might be used in a software engineering or technical context.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alternateMeanings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                partOfSpeech: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
              required: ['partOfSpeech', 'definition'],
            },
          },
          relatableSentences: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          engineeringSentence: { type: Type.STRING },
        },
        required: ['alternateMeanings', 'relatableSentences', 'engineeringSentence'],
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

// FIX: Implement getWordSuggestion to generate a new vocabulary word.
export const getWordSuggestion = async (): Promise<Omit<VocabularyWord, 'originalIndex'>> => {
  const prompt = `Generate a new, interesting vocabulary word suitable for a college student. Provide a JSON object with the following keys: "word", "partOfSpeech", "definition", "example" (a simple sentence), and "memoryTrick" (a clever way to remember the meaning).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          definition: { type: Type.STRING },
          example: { type: Type.STRING },
          memoryTrick: { type: Type.STRING },
        },
        required: ['word', 'partOfSpeech', 'definition', 'example', 'memoryTrick'],
      },
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

// FIX: Implement getWordDefinition to look up a word's definition.
export const getWordDefinition = async (word: string): Promise<SimpleDefinition> => {
    const prompt = `Provide a simple definition for the word "${word}". Return a JSON object with keys: "word", "partOfSpeech", and "definition".`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    partOfSpeech: { type: Type.STRING },
                    definition: { type: Type.STRING },
                },
                required: ['word', 'partOfSpeech', 'definition'],
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

// FIX: Implement generateImageForWord to create a visual for a word.
export const generateImageForWord = async (word: string, definition: string): Promise<string> => {
    const prompt = `Create a simple, clear, and visually appealing illustration for the vocabulary word "${word}", which means "${definition}". The image should be symbolic and easy to understand.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data; // This is the base64 string
        }
    }

    throw new Error('Image generation failed, no image data received.');
};

// FIX: Implement getDictionaryEntry to fetch a full vocabulary entry for a word.
export const getDictionaryEntry = async (wordToFetch: string): Promise<Omit<VocabularyWord, 'originalIndex'>> => {
    const prompt = `Provide a dictionary entry for the word "${wordToFetch}". Return a JSON object with the following keys: "word", "partOfSpeech", "definition", "example" (a simple sentence), and "memoryTrick" (a clever way to remember the meaning).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    partOfSpeech: { type: Type.STRING },
                    definition: { type: Type.STRING },
                    example: { type: Type.STRING },
                    memoryTrick: { type: Type.STRING },
                },
                required: ['word', 'partOfSpeech', 'definition', 'example', 'memoryTrick'],
            },
        },
    });

    const jsonText = response.text.trim();
    const entry = JSON.parse(jsonText);
    
    // Ensure the word property matches the requested word, correcting for any model variations.
    entry.word = wordToFetch;

    return entry;
};