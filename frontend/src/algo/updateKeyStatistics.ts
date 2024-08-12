import type { KeyStatistic, KeypressData } from "@shared/types";
import { calculateAccuracy, calculateWpm } from "../lib/typingTestRunHelper";

export function updateKeyStatistics(keyStatistics: KeyStatistic[], keypressData: KeypressData[]) {

  // removing the first keypress as it's timeeSinceLastKeypress would be 0
  const keypressDataOfInterest = keypressData.slice(1);

  for (const keyStatistic of keyStatistics) {
    for (const keyPress of keypressDataOfInterest) {
      if (keyStatistic.key === keyPress.targetKey || keyStatistic.key === keyPress.pressedKey) {
        // 4 possible options, 1 correct and 3 incorrect
        // target key     a  a  /  b
        // pressed key    a  /  a  a

        // case 1, correct, totalCount, correctCount and timeToPress are increased
        // case 2, incorrect, missed the letter, a was supposed to be pressed, increase totalCount
        // case 3, incorrect, extra letter, a is pressed but wans't supposed to, increase totalCount
        // case 4, incorrect, wrong letter, increased totalCount for both b AND a

        keyStatistic.totalHitCount += 1;

        if (keyPress.isCorrect) {
          keyStatistic.correctHitCount += 1;
          keyStatistic.timeToPress += keyPress.timeSinceLastKeypress;
        }
      }
    }
  }

  // updating the accuracy and wpm in batch
  for (const keyStatistic of keyStatistics) {
    keyStatistic.accuracy = calculateAccuracy(keyStatistic.correctHitCount, keyStatistic.totalHitCount);
    keyStatistic.wpm = calculateWpm(keyStatistic.correctHitCount, keyStatistic.timeToPress);
  }

  generateScores(keyStatistics);
  return keyStatistics;
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

  // why this formula?
  // The score needs to be composed of 3 things: wpm, accuracy and count
  // The count needs to be here so that keys that are pressed less are prioritized
  // the same logic goes for accuracy and wpm
  // To make all the fields have the same effect on the score I normalize it's value
  // by transforming it to a percentage where the min and max are the min and max of those fields
}