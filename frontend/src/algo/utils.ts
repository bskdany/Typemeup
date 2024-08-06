import type { FingerStatistics, FingerKeyToKeyMovement } from "../types/algo";

export function splitArray<T>(array: T[], delimiter: T): T[][] {
  const result: T[][] = [];
  let currentPart: T[] = [];

  array.forEach(element => {
    if (element === delimiter) {
      if (currentPart.length > 0) {
        result.push(currentPart);
        currentPart = [];
      }
    } else {
      currentPart.push(element);
    }
  });

  // Push the last part if it is not empty
  if (currentPart.length > 0) {
    result.push(currentPart);
  }

  return result;
}

export function generateEmptyFingersStatistics(fingerMap: string[][]) {
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