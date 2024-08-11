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
  const letterFrequency = new Map<string, number>([
    ['a', 8.17], ['b', 1.49], ['c', 2.78], ['d', 4.25], ['e', 12.70],
    ['f', 2.23], ['g', 2.02], ['h', 6.09], ['i', 6.97], ['j', 0.15],
    ['k', 0.77], ['l', 4.03], ['m', 2.41], ['n', 6.75], ['o', 7.51],
    ['p', 1.93], ['q', 0.10], ['r', 5.99], ['s', 6.33], ['t', 9.06],
    ['u', 2.76], ['v', 0.98], ['w', 2.36], ['x', 0.15], ['y', 1.97],
    ['z', 0.07]
  ]);

  const minWpm = Math.min(...keyStatistics.map(entry => entry.wpm));
  const maxWpm = Math.max(...keyStatistics.map(entry => entry.wpm));
  const minAccuracy = Math.min(...keyStatistics.map(entry => entry.accuracy));
  const maxAccuracy = Math.max(...keyStatistics.map(entry => entry.accuracy));
  const minTotalCount = Math.min(...keyStatistics.map(entry => (entry.totalHitCount) * (letterFrequency.get(entry.key) ?? 0)));
  const maxTotalCount = Math.max(...keyStatistics.map(entry => (entry.totalHitCount) * (letterFrequency.get(entry.key) ?? 0)));

  for (const keyStatistic of keyStatistics) {



    const relativeWpm = normalizeValue(keyStatistic.wpm, minWpm, maxWpm);
    const relativeAccuracy = normalizeValue(keyStatistic.accuracy, minAccuracy, maxAccuracy);
    const relativeCount = normalizeValue(keyStatistic.totalHitCount, minTotalCount, maxTotalCount);

    const score = (relativeWpm + relativeAccuracy + relativeCount) / 3;
    keyStatistic.score = score;
  }
}