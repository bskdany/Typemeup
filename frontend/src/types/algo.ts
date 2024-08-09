export interface KeyStatistic {
  key: string,
  correctHitCount: number,
  incorrectHitCount: number,
  averageTimeToPressCorrect: number,
  averageTimeToPressIncorrect: number,
  accuracy: number,
  wpm: number
}

export interface KeypressData {
  fingerNumber: number;
  targetKey: string,
  pressedKey: string,
  isCorrect: boolean;
  position: number;
  timeSinceLastKeypress: number;
}