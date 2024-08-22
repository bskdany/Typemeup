import type { KeyStatistic, UserTypingConfig } from "./types.js";

export const defaultUserTypingConfig: UserTypingConfig = {
  errorCorrectionMode: 3,
  typingMode: "test",
  typingEndMode: "time",
  typingEndTimeMode: 60,
  typingEndWordMode: 50,
  visualConfig: {
    showLiveKeypressKeyboard: true,
    showSmartModeKeyboard: true
  },
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
  theme: {
    name: "default",
    colorScheme: {
      backgroundColor: { name: 'Background', value: '#171d1f' },
      primaryColor: { name: 'Primary', value: '#383c47' },
      secondaryColor: { name: 'Secondary', value: '#2f2d2d' },
      accentColor: { name: 'Accent', value: '#a8b9e4' },
      textColor: { name: 'Text', value: '#af9292' }
    },
  },
  customTheme: {
    name: "custom",
    colorScheme: {
      backgroundColor: { name: 'Background', value: '#171d1f' },
      primaryColor: { name: 'Primary', value: '#a8b9e4' },
      secondaryColor: { name: 'Secondary', value: '#2f2d2d' },
      accentColor: { name: 'Accent', value: '#a8b9e4' },
      textColor: { name: 'Text', value: '#af9292' }
    }
  }
}

export const themes = {
  default: {
    backgroundColor: { name: 'Background', value: '#171d1f' },
    primaryColor: { name: 'Primary', value: '#383c47' },
    secondaryColor: { name: 'Secondary', value: '#2f2d2d' },
    accentColor: { name: 'Accent', value: '#a8b9e4' },
    textColor: { name: 'Text', value: '#af9292' }
  },
  monkeytype: {
    backgroundColor: { name: 'Background', value: '#323437' },
    primaryColor: { name: 'Primary', value: '#25282c' },
    secondaryColor: { name: 'Secondary', value: '#2c2e31' },
    accentColor: { name: 'Accent', value: '#e2b714' },
    textColor: { name: 'Text', value: '#646669' }
  },
  light: {
    backgroundColor: { name: 'Background', value: '#f0f0f0' },
    primaryColor: { name: 'Primary', value: '#fdc9c9' },
    secondaryColor: { name: 'Secondary', value: '#e3ddd4' },
    accentColor: { name: 'Accent', value: '#98a63c' },
    textColor: { name: 'Text', value: '#6b3869' }
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