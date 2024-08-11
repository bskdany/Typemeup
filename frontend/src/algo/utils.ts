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

export function generateKeyStatistic(fingerMap: string[][]) {
  const keyMap = [];

  for (const finger of fingerMap) {
    for (const letter of finger) {
      keyMap.push(letter, {
        key: letter,
        correctHitCount: 0,
        incorrectHitCount: 0,
        averageTimeToPressCorrect: 0,
        averageTimeToPressIncorrect: 0,
        accuracy: 0,
        wpm: 0
      })
    }
  }
}

export function reverseFingerMap(fingerMap: string[][]) {
  let keyToFingerMap = new Map<string, number>();

  for (let fingerCounter = 0; fingerCounter < fingerMap.length; fingerCounter++) {
    for (const letter of fingerMap[fingerCounter]) {
      keyToFingerMap.set(letter, fingerCounter);
    }
  }
  return keyToFingerMap;
}