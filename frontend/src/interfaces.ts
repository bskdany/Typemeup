export interface WordObject {
    letters: Letter[];
    id: number;
    isCompleted: boolean;
    length: number;
}

export interface TypingError {
    type: number;
    message: string;
    active: boolean;
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
}

export interface WordsSource {
    length: number;
    words: string[];
}