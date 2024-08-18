export interface TextObject {
  letters: Letter[];
  id: number;
  isCompleted: boolean;
  length: number;
}

export interface FingerErrorData {
  fingerNumber: number;
  burstStarted: number;

}

export interface UserTypedText {
  letter: string,
  isCorrent: boolean;
}

export interface Letter {
  text: string;
  isSpace: boolean;
  isCorrect: boolean;
  isTyped: boolean;
  errorStatus: "extra" | "missed" | "swapped" | "wrong" | "";
  id: number;
}

export interface WordsSource {
  length: number;
  words: string[];
}

export interface TypingContextData {
  displayTypingTest: boolean;
  typingTestStatus: "started" | 'ended' | "pending";
  progressTimeElapsed: number;
  progressWordsTyped: number;
  livePressedKey: { key: string, count: number };
}

export interface TypingContext {
  typingContextData: TypingContextData;
}

export interface TypingResultContextData {
  activeLetterId: number,
  typingTestReplayStatus: "active" | "inactive"
}

export interface TypingResultContext {
  typingResultContextData: TypingResultContextData
}

export interface TypingTestRunData {
  timeTaken: number;
  targetText: string[];   // word by word`
  userTypedText: string[];// letter by letter
  keyPressTimings: number[];
  textObject: TextObject[];
  errorCorrectionMode: number;
  timeStarted: string;
  timeEnded: string;
}

export type PastTypingTestResult = {
  typingMode: string;
  typingEndMode: string;
  errorCorrectionMode: number;
  timeStarted: string;
  timeEnded: string;
  timeTaken: number;
  wpm: number;
  accuracy: number;
};


