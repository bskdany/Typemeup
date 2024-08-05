import { FingerKeyToKeyMovement, FingerStatistics } from "../types/algoTypes.js";

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

export function generateFingersStatistics(fingerMap: string[][]) {
  const fingersStatistics: FingerStatistics[] = [];

  for (let i = 0; i < fingerMap.length; i++) {

    const fingerKeyToKeyMovement: FingerKeyToKeyMovement[] = [];
    const keySet = fingerMap[i];

    for (const sourceKey of keySet) {
      for (const destinationKey of keySet) {
        fingerKeyToKeyMovement.push({
          sourceKey: sourceKey,
          destinationKey: destinationKey,
          confidence: 0
        })
      }
    }

    fingersStatistics.push({
      fingerNumber: i,
      keyPressData: [],
      keyToKeyMovements: [...fingerKeyToKeyMovement],
      totalCorrectHitCount: 0,
      totalWrongHitCount: 0,
      totalConfidence: 0,
      totalError: 0,
      accuracy: 0
    });
  }

  return fingersStatistics;
}