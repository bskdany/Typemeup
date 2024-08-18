import type { KeyStatistic, UserTypingConfig } from "@shared/types";

export const defaultUserTypingConfig: UserTypingConfig = {
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
  },
  colorScheme: {
    backgroundColor: { name: 'Background', value: '#171d1f' },
    primaryColor: { name: 'Primary', value: '#2c2e31' },
    secondaryColor: { name: 'Secondary', value: '#7f6a6a' },
    accentColor: { name: 'Accent', value: '#a8b9e4' },
    textColor: { name: 'Text', value: '#ffffff' }
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
        timeToPress: 0,
        accuracy: 0,
        wpm: 0,
        score: 0
      })
    }
  }

  return keyMap;
}

export const defaultKeyStatitisc = generateKeyStatistic(defaultUserTypingConfig.smartModeConfig.fingerMap);