import type { FingerStatistics, FingerKeyToKeyMovement } from "../types/algo";

export function reverseFingerMap(fingerMap: string[][]) {
  let keyToFingerMap = new Map<string, number>();

  for (let fingerCounter = 0; fingerCounter < fingerMap.length; fingerCounter++) {
    for (const letter of fingerMap[fingerCounter]) {
      keyToFingerMap.set(letter, fingerCounter);
    }
  }
  return keyToFingerMap;
}

