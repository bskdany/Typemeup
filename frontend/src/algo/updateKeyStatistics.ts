import type { KeyStatistic, KeypressData } from "@shared/types";
import { calculateAccuracy, calculateWpm } from "../lib/typingTestRunHelper";

export function updateKeyStatistics(keyStatistics: KeyStatistic[], keypressData: KeypressData[]) {
  for (const keyStatistic of keyStatistics) {
    for (const keyPress of keypressData) {
      if (keyStatistic.key === keyPress.pressedKey) {
        updateKeyStatisticWithKeypressData(keyStatistic, keyPress)
      }
    }
  }

  generateScores(keyStatistics);
  return keyStatistics;
}

function updateKeyStatisticWithKeypressData(keyStatistic: KeyStatistic, keypressData: KeypressData) {
  keyStatistic.totalHitCount += 1;
  keyStatistic.totalTimeToPress += keypressData.timeSinceLastKeypress;

  if (keypressData.isCorrect) {
    keyStatistic.correctHitCount += 1;
    keyStatistic.correctTimeToPress += keypressData.timeSinceLastKeypress
  }

  keyStatistic.accuracy = calculateAccuracy(keyStatistic.correctHitCount, keyStatistic.totalHitCount);
  keyStatistic.wpm = calculateWpm(keyStatistic.correctHitCount, keyStatistic.correctTimeToPress);
}

function normalizeValue(value: number, min: number, max: number) {
  if (max - min === 0) {
    console.error("Delta max and min is 0!")
    return 0;
  }
  return (100 / (max - min)) * (value - min);
}

function generateScores(keyStatistics: KeyStatistic[]) {
  const minWpm = Math.min(...keyStatistics.map(entry => entry.wpm));
  const maxWpm = Math.max(...keyStatistics.map(entry => entry.wpm));
  const minAccuracy = Math.min(...keyStatistics.map(entry => entry.accuracy));
  const maxAccuracy = Math.max(...keyStatistics.map(entry => entry.accuracy));
  const minTotalCount = Math.min(...keyStatistics.map(entry => (entry.totalHitCount)));
  const maxTotalCount = Math.max(...keyStatistics.map(entry => (entry.totalHitCount)));

  for (const keyStatistic of keyStatistics) {

    const relativeWpm = normalizeValue(keyStatistic.wpm, minWpm, maxWpm);
    const relativeAccuracy = normalizeValue(keyStatistic.accuracy, minAccuracy, maxAccuracy);
    const relativeCount = normalizeValue(keyStatistic.totalHitCount, minTotalCount, maxTotalCount);

    const score = (relativeWpm + relativeAccuracy + relativeCount) / 3;
    keyStatistic.score = score;
  }
}