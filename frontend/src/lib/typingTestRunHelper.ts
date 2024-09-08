import type { TypingTestRunData, Letter } from "../types/interfaces";

function calculateWpm(correctCharCount: number, msTime: number): number {
  const timeInMinutes = msTime / (60 * 1000);

  if (timeInMinutes === 0) {
    return 0;
  }
  return parseFloat(((correctCharCount / 5) / timeInMinutes).toFixed(2)) ?? 0;
}

function calculateAccuracy(correctCharCount: number, totalChartCount: number): number {
  if (totalChartCount === 0) {
    return 0;
  }
  return parseFloat(((correctCharCount / totalChartCount) * 100).toFixed(1)) ?? 0;
}

function getRawWpm(typingTestRunData: TypingTestRunData): number {
  return calculateWpm(typingTestRunData.userTypedText.length, typingTestRunData.timeTaken);
}

function getWpm(typingTestRunData: TypingTestRunData): number {
  return calculateWpm(typingTestRunData.correctKeyPresses, typingTestRunData.timeTaken);
}

function getAccuracy(typingTestRunData: TypingTestRunData): number {
  return calculateAccuracy(typingTestRunData.correctKeyPresses, typingTestRunData.totalKeyPresses);
}

function getTime(typingTestRunData: TypingTestRunData): number {
  return parseFloat((typingTestRunData.timeTaken / 1000).toFixed(2));
}

function getLetters(typingTestRunData: TypingTestRunData): Letter[] {
  return typingTestRunData.textObject.map((textObject) => textObject.letters).flat();
}

function getWrongCharCount(typingContextData: TypingTestRunData, status: "extra" | "missed" | "swapped" | "wrong"): number {
  return getLetters(typingContextData).filter((letter) => letter.errorStatus === status).length;
}

export { calculateWpm, calculateAccuracy, getRawWpm, getWpm, getAccuracy, getTime, getWrongCharCount };
