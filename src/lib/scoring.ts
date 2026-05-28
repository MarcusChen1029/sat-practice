import type { ChoiceLetter } from "./types";
export function isCorrect(chosen: ChoiceLetter, correct: ChoiceLetter): boolean {
  return chosen === correct;
}
