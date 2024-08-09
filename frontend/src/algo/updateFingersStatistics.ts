import { calculateAccuracy, calculateWpm } from "$lib/typingTestRunHelper";
import type { FingerStatistics, KeyData, KeypressData } from "../types/algo";

export function updateFingersStatistics(fingersStatistics: FingerStatistics[], fingersKeyPressData: KeypressData[][]) {
  for (let counter = 0; counter < fingersStatistics.length; counter++) {
    const fingerStatistics: FingerStatistics = fingersStatistics[counter];
    const keypressData: KeypressData[] = fingersKeyPressData[counter];

    for (const keyData of fingerStatistics.keyData) {
      for (const keypress of keypressData) {
        if (keypress.pressedKey === keyData.key) {
          updateKeyDataWithKeypressData(keyData, keypress);
        }
      }
    }
  }
}

function updateKeyDataWithKeypressData(keyData: KeyData, keypressData: KeypressData) {
  const keyDataTotalHitCount = keyData.correctHitCount + keyData.incorrectHitCount;

  if (keypressData.isCorrect) {
    keyData.correctHitCount += 1;
    keyData.averageTimeToPressCorrect = ((keyData.averageTimeToPressCorrect * keyDataTotalHitCount) + keypressData.timeSinceLastKeypress) / (keyDataTotalHitCount + 1);
  }
  else {
    keyData.incorrectHitCount += 1;
    keyData.averageTimeToPressIncorrect = ((keyData.averageTimeToPressIncorrect * keyDataTotalHitCount) + keypressData.timeSinceLastKeypress) / (keyDataTotalHitCount + 1);
  }

  keyData.accuracy = calculateAccuracy(keyData.correctHitCount, keyData.correctHitCount + keyData.incorrectHitCount);
  keyData.wpm = calculateWpm(keyData.correctHitCount, (keyData.averageTimeToPressCorrect + keyData.averageTimeToPressIncorrect) / 2);
}