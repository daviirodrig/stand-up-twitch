import { z } from "zod";

// Define the schemas for validation
const ActionSchema = z.object({
  type: z.string(),
  range: z.number().int().positive(),
  limit: z.number().int().positive(),
});

// Action definitions
export const laugh_action = ActionSchema.parse({
  type: "laugh",
  range: 6,
  limit: 5,
});

export const gasp_action = ActionSchema.parse({
  type: "gasp",
  range: 6,
  limit: 7,
});

export const clap_action = ActionSchema.parse({
  type: "clap",
  range: 1,
  limit: 2,
});

// Default triggers
const defaultLaughTriggers = ["OMEGALUL", "KEKW"];
const defaultGaspTriggers = ["D:"];
const defaultClapTriggers = ["Clap"];

// Helper function to get triggers from localStorage
function getTriggers(key: string, defaultValue: string[]): string[] {
  const storedValue = localStorage.getItem(key);
  if (!storedValue) {
    return defaultValue;
  }
  try {
    // Validate the stored data structure
    const parsedValue = z.array(z.string()).safeParse(JSON.parse(storedValue));
    if (parsedValue.success) {
      return parsedValue.data;
    } else {
      console.error(
        `Invalid data found in localStorage for key "${key}":`,
        parsedValue.error
      );
      // Fallback to default if stored data is invalid
      localStorage.setItem(key, JSON.stringify(defaultValue)); // Correct the stored value
      return defaultValue;
    }
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    // Fallback to default if parsing fails
    localStorage.setItem(key, JSON.stringify(defaultValue)); // Correct the stored value
    return defaultValue;
  }
}

// Helper function to set triggers in localStorage
function setTriggers(key: string, triggers: string[]): void {
  try {
    // Validate before saving
    const validatedTriggers = z.array(z.string()).parse(triggers);
    localStorage.setItem(key, JSON.stringify(validatedTriggers));
  } catch (error) {
    console.error(
      `Error validating or setting triggers for key "${key}":`,
      error
    );
    // Optionally, handle the error, e.g., show a message to the user
  }
}

// Getter and Setter functions for each action type
export const getLaughTriggers = () =>
  getTriggers("laughTriggers", defaultLaughTriggers);
export const setLaughTriggers = (triggers: string[]) =>
  setTriggers("laughTriggers", triggers);

export const getGaspTriggers = () =>
  getTriggers("gaspTriggers", defaultGaspTriggers);
export const setGaspTriggers = (triggers: string[]) =>
  setTriggers("gaspTriggers", triggers);

export const getClapTriggers = () =>
  getTriggers("clapTriggers", defaultClapTriggers);
export const setClapTriggers = (triggers: string[]) =>
  setTriggers("clapTriggers", triggers);

// Combine actions with their trigger getters for potential use elsewhere if needed
// Note: The primary usage will likely involve calling the getters directly in chat.ts
export const emoteActions = [
  { action: laugh_action, getTriggers: getLaughTriggers },
  { action: gasp_action, getTriggers: getGaspTriggers },
  { action: clap_action, getTriggers: getClapTriggers },
];
