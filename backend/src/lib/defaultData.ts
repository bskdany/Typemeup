import { KeyStatistic } from "../types/algoTypes.js";

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
      ['i', 'k', ','],
      ['o', 'l', '.'],
      ['p', ';', '/'],
      [' '],
      []
    ],
    defaultFingersPosition: ["a", "s", "d", "f", "j", "k", "l", ";", " ", ""],
  }
}

export function generateKeyStatistic(fingerMap: string[][]) {
  const keyMap = new Map<string, KeyStatistic>();

  for (const finger of fingerMap) {
    for (const letter of finger) {
      keyMap.set(letter, {
        key: letter,
        correctHitCount: 0,
        incorrectHitCount: 0,
        averageTimeToPressCorrect: 0,
        averageTimeToPressIncorrect: 0,
        accuracy: 0,
        wpm: 0
      })
    }
  }

  return keyMap;
}