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

export interface FingerStatistics {
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
  fingersStatistics: FingerStatistics[],
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