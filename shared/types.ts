export interface KeyStatistic {
  key: string,
  totalHitCount: number,
  correctHitCount: number,
  totalTimeToPress: number,
  correctTimeToPress: number,
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