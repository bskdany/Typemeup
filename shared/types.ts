export interface KeyStatistic {
  key: string,
  totalHitCount: number,
  correctHitCount: number,
  timeToPress: number, // this is only incremented when the keypress is correct
  accuracy: number,
  wpm: number,
  score: number,
}

export interface KeypressData {
  fingerNumber: number;
  targetKey: string,
  pressedKey: string,
  isCorrect: boolean;
  position: number;
  timeSinceLastKeypress: number;
}

export interface UserTypingConfig {
  errorCorrectionMode: number,
  typingMode: "test" | "smart" | "compete",
  typingEndMode: "time" | "words",
  typingEndTimeMode: number,
  typingEndWordMode: number,
  smartModeConfig: {
    fingerMap: string[][],
    defaultFingersPosition: string[],
  },
  theme: {
    name: string,
    colorScheme: ColorScheme
  },
  customTheme: {
    name: string,
    colorScheme: ColorScheme
  }
}

export interface ColorScheme {
  backgroundColor: { name: string, value: string },
  primaryColor: { name: string, value: string },
  secondaryColor: { name: string, value: string },
  accentColor: { name: string, value: string },
  textColor: { name: string, value: string },
  [key: string]: { name: string, value: string }
}