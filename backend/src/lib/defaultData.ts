import type { KeyStatistic } from "@shared/types";

export const defaultUserTypingConfig = {
  errorCorrectionMode: 3,
  typingMode: "test",
  typingEndMode: "time",
  typingEndTimeMode: 60,
  typingEndWordMode: 50,
  smartModeConfig: {
    fingerMap: [
      ['q', 'a', 'z'],
      ['w', 's', 'x'],
      ['e', 'd', 'c'],
      ['r', 'f', 'v', 't', 'g', 'b'],
      ['u', 'j', 'm', 'y', 'h', 'h', 'n'],
      ['i', 'k'],
      ['o', 'l'],
      ['p'],
      [' '],
      []
    ],
    defaultFingersPosition: ["a", "s", "d", "f", "j", "k", "l", ";", " ", ""],
  }
}

export function generateKeyStatistic(fingerMap: string[][]) {
  const keyMap: KeyStatistic[] = [];

  for (const finger of fingerMap) {
    for (const letter of finger) {
      keyMap.push({
        key: letter,
        totalHitCount: 0,
        correctHitCount: 0,
        totalTimeToPress: 0,
        correctTimeToPress: 0,
        accuracy: 0,
        wpm: 0,
        score: 0
      })
    }
  }

  return keyMap;
}