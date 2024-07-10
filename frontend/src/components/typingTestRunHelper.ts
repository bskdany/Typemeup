import type { Letter, TypingTestRunData } from "../interfaces";

function calculateWpm(correctCharCount: number, msTime: number) {
  return parseFloat(((correctCharCount / 4.7) * (60 / (msTime / 1000))).toFixed(2));
}

function getRawWpm(typingTestRunData: TypingTestRunData): number {
  return calculateWpm(typingTestRunData.userTypedText.length, typingTestRunData.timeTaken);
}

function getWpm(typingTestRunData: TypingTestRunData): number {
  return calculateWpm(getCorrectCharCount(typingTestRunData), typingTestRunData.timeTaken);
}

function getAccuracy(typingTestRunData: TypingTestRunData): number {
  return parseFloat(((getCorrectCharCount(typingTestRunData) / mergeTargetTextWords(typingTestRunData.targetText).length) * 100).toFixed(1));
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

export { calculateWpm, getRawWpm, getWpm, getAccuracy, getTime, getCorrectCharCount, getWrongCharCount };