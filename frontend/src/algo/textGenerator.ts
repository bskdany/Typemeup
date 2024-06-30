import type { FingerData, UserTypingData } from "../interfaces";
import wordsFile from "../words/words.json";

export function generateWordsAlgo(userTypingData: UserTypingData, howManyWords: number) {
  // i see that there is not 1 best way to generate words based on the statistics, 
  // there are several factors that can be looked at
  // 1. accuracy
  // 2. confidence
  // 3. movement averaged confidence (confidence / number of movements assigned to the finger)

  const allPossibleWords: string[] = wordsFile.words;

  // accuracy based word suggestion
  const fingerTrainingOrder: number[][] = [];
  for (const FingerData of userTypingData.fingersStatistics) {
    fingerTrainingOrder.push([FingerData.fingerNumber, FingerData.accuracy]);
  }
  // TODO: Make this choose randomly between the values when they are the same 
  fingerTrainingOrder.sort((a, b) => {
    if (a[1] !== b[1]) {
      return a[1] - b[1];
    }
    else {
      return Math.random() - 0.5;
    }
  });

  const howManyFingersToTrain: number = 3;

  let fingersToTrain: number[] = [];
  for (let i = 0; i < howManyFingersToTrain; i++) {
    fingersToTrain.push(fingerTrainingOrder[i][0]);
  }

  // from here on I don't know what I'm doing, realistically I want to pick up the words that have 
  // the most letters for a specified finger, but for that I would need to compare all of them
  // so the smart way to do is to precompute the table, for each letter of the alphabet, but for now
  // lets just do this at every run

  // each letter will point to a list of words that contain that letter, sorted from the word
  // containing most letters to the least
  const lettersToWordsMap: Map<string, Map<string, number>> = new Map();
  for (const fingerLetters of userTypingData.fingerMap) {
    for (const letter of fingerLetters) {
      lettersToWordsMap.set(letter, new Map());
    }
  }

  // COMPUTE INTENSIVE PLEASE REMOVE 
  for (const word of allPossibleWords) {
    const letterOccurencyMap = new Map<string, number>();
    for (const letter of word) {
      // if letter not in there then it is added and increased, else just increased
      letterOccurencyMap.set(letter, (letterOccurencyMap.get(letter) ?? 0) + 1);
    }

    letterOccurencyMap.forEach((value, key) => {
      letterOccurencyMap.set(key, value);
    })

    letterOccurencyMap.forEach((amount, letter) => {
      lettersToWordsMap.get(letter)?.set(word, amount);
    })
  }

  const wordsByTargetFingersContent: Map<string, number> = new Map();
  for (const finger of fingersToTrain) {
    for (const letter of userTypingData.fingerMap[finger]) {
      for (const word of lettersToWordsMap.get(letter)?.entries() ?? []) {
        const contentPercentage: number = wordsByTargetFingersContent.get(word[0]) ?? 0;

        wordsByTargetFingersContent.set(word[0], contentPercentage + word[1]);
      }
    }
  }

  // sorting the words
  const wordsRankedByTargetFingerContent: [string, number][] = [];
  for (const entry of wordsByTargetFingersContent) {
    // now I weight the letter percentage with the amount of letters in the word
    wordsRankedByTargetFingerContent.push([entry[0], (entry[1] / entry[0].length) * entry[1]]);
  }
  wordsRankedByTargetFingerContent.sort((a, b) => -(a[1] - b[1]))

  //console.log(lettersToWordsMap)
  console.log(wordsRankedByTargetFingerContent)
  console.log(fingersToTrain)
  console.log(fingerTrainingOrder);

  const finalWords: string[] = wordsRankedByTargetFingerContent
    .map(entry => entry[0])
    .slice(0, howManyWords)
    .sort(() => Math.random() - 0.5);

  return finalWords;
}

export function generateWords(howManyWords: number): string[] {
  const words: string[] = [];

  for (let i = 0; i < howManyWords; i++) {
    const index = Math.round(Math.random() * (wordsFile.length - 1));
    words.push(wordsFile.words[index])
  }
  return words;
}