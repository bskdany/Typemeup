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
  return calculateWpm(getCorrectCharCount(typingTestRunData), typingTestRunData.timeTaken);
}

function getAccuracy(typingTestRunData: TypingTestRunData): number {
  return calculateAccuracy(getCorrectCharCount(typingTestRunData), mergeTargetTextWords(typingTestRunData.targetText).length);
}

function getTime(typingTestRunData: TypingTestRunData): number {
  return parseFloat((typingTestRunData.timeTaken / 1000).toFixed(2));
}

function mergeTargetTextWords(targetText: string[]): string[] {
  const targetTextMerged: string[] = [];

  for (const word of targetText) {
    for (const letter of word) {
      targetTextMerged.push(letter)
    }
    targetTextMerged.push(" ");
  }
  targetTextMerged.pop();

  return targetTextMerged;
}

function getLetters(typingTestRunData: TypingTestRunData): Letter[] {
  return typingTestRunData.textObject.map((textObject) => textObject.letters).flat();
}

function getCorrectCharCount(typingTestRunData: TypingTestRunData): number {
  return getLetters(typingTestRunData).filter((letter) => letter.isCorrect === true).length;
}

function getWrongCharCount(typingContextData: TypingTestRunData, status: "extra" | "missed" | "swapped" | "wrong"): number {
  return getLetters(typingContextData).filter((letter) => letter.errorStatus === status).length;
}

export { calculateWpm, calculateAccuracy, getRawWpm, getWpm, getAccuracy, getTime, getCorrectCharCount, getWrongCharCount };