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
  // https://en.wikipedia.org/wiki/Letter_frequency
  const lettersFrequency = new Map<string, number>([
    ['a', 8.17], ['b', 1.49], ['c', 2.78], ['d', 4.25], ['e', 12.70],
    ['f', 2.23], ['g', 2.02], ['h', 6.09], ['i', 6.97], ['j', 0.15],
    ['k', 0.77], ['l', 4.03], ['m', 2.41], ['n', 6.75], ['o', 7.51],
    ['p', 1.93], ['q', 0.10], ['r', 5.99], ['s', 6.33], ['t', 9.06],
    ['u', 2.76], ['v', 0.98], ['w', 2.36], ['x', 0.15], ['y', 1.97],
    ['z', 0.07]
  ]);

  // adjusting the entries frequencies
  for (const [letter, letterFrequency] of lettersFrequency.entries()) {
    lettersFrequency.set(letter, letterFrequency)
  }

  // calculating the min and max for each valu
  const minWpm = Math.min(...keyStatistics.filter(entry => entry.key !== " ").map(entry => entry.wpm));
  const maxWpm = Math.max(...keyStatistics.filter(entry => entry.key !== " ").map(entry => entry.wpm));
  const minAccuracy = Math.min(...keyStatistics.filter(entry => entry.key !== " ").map(entry => entry.accuracy));
  const maxAccuracy = Math.max(...keyStatistics.filter(entry => entry.key !== " ").map(entry => entry.accuracy));

  // the hitCount is multiplied by 100 - letterFrequency to normalize the count
  // the text the user types follows the lettresFrequency data, so to create a fair
  // representation of what key is undertrained this step is needed 
  const minTotalCount = Math.min(...keyStatistics.filter(entry => entry.key !== " ").map(entry => (entry.totalHitCount * (100 - (lettersFrequency.get(entry.key) ?? 0)))));
  const maxTotalCount = Math.max(...keyStatistics.filter(entry => entry.key !== " ").map(entry => (entry.totalHitCount * (100 - (lettersFrequency.get(entry.key) ?? 0)))));

  for (const keyStatistic of keyStatistics) {
    if (keyStatistic.key !== " ") {
      const relativeWpm = normalizeValue(keyStatistic.wpm, minWpm, maxWpm);
      const relativeAccuracy = normalizeValue(keyStatistic.accuracy, minAccuracy, maxAccuracy);
      const relativeCount = normalizeValue(keyStatistic.totalHitCount * (100 - (lettersFrequency.get(keyStatistic.key) ?? 0)), minTotalCount, maxTotalCount);

      const score = relativeWpm + relativeAccuracy + relativeCount;
      keyStatistic.score = score;
    }
  }

  // why this formula?
  // The score needs to be composed of 3 things: wpm, accuracy and count
  // The count needs to be here so that keys that are pressed less are prioritized
  // the same logic goes for accuracy and wpm
  // To make all the fields have the same effect on the score I normalize it's value
  // by transforming it to a percentage where the min and max are the min and max of those fields
}