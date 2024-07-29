import type { FingerData, FingerKeyToKeyMovement, UserTypingData } from "../interfaces";

function saveObjectToLocalStorage<T>(key: string, obj: T): void {
  if (typeof window === "undefined") {
    console.error("localStorage is not available in this environment.");
  }
  else {
    try {
      const serializedObj = JSON.stringify(obj);
      localStorage.setItem(key, serializedObj);
    } catch (e) {
      console.error("Error saving to local storage", e);
    }
  }
}

function getObjectFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    console.error("localStorage is not available in this environment.");
    return null;
  }
  else {
    try {
      const serializedObj = localStorage.getItem(key);
      if (serializedObj === null) {
        return null;
      }
      return JSON.parse(serializedObj) as T;
    } catch (e) {
      console.error("Error reading from local storage", e);
      return null;
    }
  }
}

export function getUserTypingData(): UserTypingData {
  const userTypingData: UserTypingData | null = getObjectFromLocalStorage("userTypingData");
  if (userTypingData === null) {
    // initializing the default user data object

    // hardcoding the fingermap like a boss
    const fingerMap: string[][] = [
      ["q", "a", "z"],
      ["w", "s", "x"],
      ["e", "d", "c"],
      ["r", "f", "v", "t", "g", "b"],
      ["u", "j", "m", "y", "h", "h", "n"],
      ["i", "k", ","],
      ["o", "l", "."],
      ["p", ";", "/"],
      [" "],
    ];

    const defaultFingerPositions: string[] = ["a", "s", "d", "f", "j", "k", "l", ";", " "];

    const userTypingData: UserTypingData = {
      fingersStatistics: initializeFingersStatistics(fingerMap),
      fingerMap: fingerMap,
      defaultFingersPosition: defaultFingerPositions,
      testsCompleted: 0
    }

    saveObjectToLocalStorage("userTypingData", userTypingData);
    return userTypingData;
  }
  else {
    return userTypingData;
  }
}

function initializeFingersStatistics(fingerMap: string[][]) {

  const fingersStatistics: FingerData[] = [];

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


