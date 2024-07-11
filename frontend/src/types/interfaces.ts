export interface TextObject {
  letters: Letter[];
  id: number;
  isCompleted: boolean;
  length: number;
}

export interface FingerKeypressData {
  isCorrect: boolean;
  probability: number;
  lastFingerPosition: string;
  targetKey: string;
  pressedKey: string;
  errorType: number;
  position: number;
  fingerNumber: number;
  isBurts: boolean;
  whenWasLastKeyPressed: number;
}

export interface FingerData {
  fingerNumber: number,
  keyPressData: FingerKeypressData[][],
  keyToKeyMovements: FingerKeyToKeyMovement[],
  totalCorrectHitCount: number,
  totalWrongHitCount: number,
  totalConfidence: number,
  totalError: number,
  accuracy: number
}

export interface UserTypingData {
  fingersStatistics: FingerData[],
  fingerMap: string[][],
  defaultFingersPosition: string[],
  testsCompleted: number
}

export interface FingerKeyToKeyMovement {
  sourceKey: string,
  destinationKey: string,
  confidence: number
}

export interface TypingAnalysisError {
  targetKeys: string[];
  pressedKeys: string[],
  fingerConfiguration: string[];
  positionIndex: number;
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
  configTypingMode: "words" | "time" | "smart";
  configWordAmount: number;
  configTimeAmount: number;
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
}