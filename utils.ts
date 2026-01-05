import { RefinedContentItem } from "./types";

export const cleanJson = (text: string | null): string | null => {
  if (!text) return null;
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
};

// Convert Refiner content array to plain text
export const contentToString = (contentArr: RefinedContentItem[]): string => {
  if (!contentArr || !Array.isArray(contentArr)) return "";
  return contentArr.map(c => c.text).join("");
};
