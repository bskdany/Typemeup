import type { KeyStatistic } from "@shared/types";
import wordsFile from "../words/words.json";
import { userData } from "../shared/userData.svelte";

function generateLettersToWordsByAffinities(allPossibleWords: string[], letters: string[]) {
  // each letter will point to a list of words that contain that letter, sorted from the word
  // containing most letters to the least
  const lettersToWordsAffinities: Map<string, Map<string, number>> = new Map();
  for (const letter of letters) {
    lettersToWordsAffinities.set(letter, new Map());
  }

  // COMPUTE INTENSIVE PLEASE REMOVE 
  for (const word of allPossibleWords) {
    // calculate how many of each letter there is in a word
    const letterOccurencyMap = new Map<string, number>();
    for (const letter of word) {
      // if letter not in there then it is added and increased, else just increased
      letterOccurencyMap.set(letter, (letterOccurencyMap.get(letter) ?? 0) + 1);
    }

    // transform the letter count in affinity
    letterOccurencyMap.forEach((amount, letter) => {
      // the affinity is made relative to the ideal word of size 5
      // this is done do not give advantage to longer words that are 
      // more likely to have the target letter
      const affinity = (5 / word.length) * amount;
      letterOccurencyMap.set(letter, affinity);
      lettersToWordsAffinities.get(letter)?.set(word, affinity);
    })
  }

  // sorting the words by affinity
  lettersToWordsAffinities.forEach((words, letter) => {
    const sortedWords = new Map([...words.entries()].sort((a, b) => b[1] - a[1]));
    lettersToWordsAffinities.set(letter, sortedWords)

  })

  return lettersToWordsAffinities;
}

function mergeAffinitiesByKeyWeight(lettersToWordsAffinities: Map<string, Map<string, number>>, keyStatistics: KeyStatistic[]) {
  const mergedAffinities: Map<string, number> = new Map();

  keyStatistics.forEach((keyStatistic) => {
    lettersToWordsAffinities.get(keyStatistic.key)?.forEach((affinity, word) => {
      mergedAffinities.set(word, affinity * keyStatistic.score + (mergedAffinities.get(word) ?? 0))
    })
  })

  return [...mergedAffinities.entries()].sort((a, b) => a[1] - b[1]);
}

export function generateWordsAlgo2(keyStatistics: KeyStatistic[], howManyWords: number) {
  const lettersToWordsAffinities = generateLettersToWordsByAffinities(wordsFile.words, userData.userTypingConfig.smartModeConfig.fingerMap.flat(2));
  // console.log(lettersToWordsAffinities)

  const mergedAffinities = mergeAffinitiesByKeyWeight(lettersToWordsAffinities, keyStatistics);
  // console.log(mergedAffinities);

  return chooseRandomFromWordlist(mergedAffinities.map(entry => entry[0]).filter((entry, index) => index < howManyWords * 2), howManyWords);
}

export function generateRandomWords(howManyWords: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < howManyWords; i++) {
    const randomVal = Math.random();
    const index = Math.round(randomVal * (wordsFile.words.length - 1));
    words.push(wordsFile.words[index])
  }
  return words;
}

export function chooseRandomFromWordlist(words: string[], howManyWords: number) {
  const choosenWords: string[] = [];
  for (let i = 0; i < howManyWords; i++) {
    const randomVal = Math.random();
    const index = Math.round(randomVal * (words.length - 1));
    choosenWords.push(words[index])
  }
  return choosenWords;
}