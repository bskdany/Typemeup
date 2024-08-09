import { calculateAccuracy, calculateWpm } from "$lib/typingTestRunHelper";
import type { KeyStatistic, KeypressData } from "../types/algo";

export function updateKeyStatistics(keyStatistics: Map<string, KeyStatistic>, keypressData: KeypressData[]) {
  for (const keyStatistic of keyStatistics.values()) {
    for (const keyPress of keypressData) {
      if (keyStatistic.key === keyPress.pressedKey) {
        updateKeyStatisticWithKeypressData(keyStatistic, keyPress)
      }
    }
  }
}

function updateKeyStatisticWithKeypressData(keyStatistics: KeyStatistic, keypressData: KeypressData) {
  const keyStatisticsTotalHitCount = keyStatistics.correctHitCount + keyStatistics.incorrectHitCount;

  if (keypressData.isCorrect) {
    keyStatistics.correctHitCount += 1;
    keyStatistics.averageTimeToPressCorrect = ((keyStatistics.averageTimeToPressCorrect * keyStatisticsTotalHitCount) + keypressData.timeSinceLastKeypress) / (keyStatisticsTotalHitCount + 1);
  }
  else {
    keyStatistics.incorrectHitCount += 1;
    keyStatistics.averageTimeToPressIncorrect = ((keyStatistics.averageTimeToPressIncorrect * keyStatisticsTotalHitCount) + keypressData.timeSinceLastKeypress) / (keyStatisticsTotalHitCount + 1);
  }

  keyStatistics.accuracy = calculateAccuracy(keyStatistics.correctHitCount, keyStatistics.correctHitCount + keyStatistics.incorrectHitCount);
  keyStatistics.wpm = calculateWpm(keyStatistics.correctHitCount, (keyStatistics.averageTimeToPressCorrect + keyStatistics.averageTimeToPressIncorrect) / 2);
}