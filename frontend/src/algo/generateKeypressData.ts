import type { KeypressData } from "@shared/types";
import { reverseFingerMap } from "./utils";

export function generateKeypressData(targetTextByWord: string[], userTypedText: string[], fingerMap: string[][], defaultFingerPositions: string[], keyPressTimings: number[]) {
  const reversedFingerMap = reverseFingerMap(fingerMap);

  const targetText: string[] = [];

  for (const word of targetTextByWord) {
    for (const letter of word) {
      targetText.push(letter)
    }
    targetText.push(" ");
  }
  targetText.pop(); // to remove the last unneccesary space

  // step 1, aligning the target text and the user typed text
  const [alignedTargetText, alignedUserTypedText] = alignText([...targetText], [...userTypedText]);

  // step 2, generating data keypress by keypress
  const keypressData: KeypressData[] = constructKeypressData([...alignedTargetText], [...alignedUserTypedText], reversedFingerMap);

  // step 3, doing additional processing to keypressData to get out more information
  populateKeypressTimings(keypressData, keyPressTimings);

  return keypressData;
}

function alignText(targetText: string[], userTypedText: string[], maxTextCorrection: number = 3): [string[], string[]] {
  if (userTypedText[0] === "Backspace" || userTypedText[userTypedText.length] === "Backspace") {
    throw "Logic error, user can't start or end with backspace";
  }

  let targetTextCounter = maxTextCorrection;
  let userTypedTextCounter = maxTextCorrection;

  let alignedTargetText: string[] = [];
  let alignedUserText: string[] = [];

  for (let i = 0; i < maxTextCorrection; i++) {
    targetText.push("/");
    targetText.unshift("/");
    userTypedText.push("/");
    userTypedText.unshift("/");
  }

  while (targetTextCounter < targetText.length - maxTextCorrection || userTypedTextCounter < userTypedText.length - maxTextCorrection) {
    const targetLetter: string = targetText[targetTextCounter];
    const userTypedLetter: string = userTypedText[userTypedTextCounter];

    if (targetLetter === userTypedLetter) {
      alignedTargetText.push(targetLetter);
      alignedUserText.push(userTypedLetter);
      targetTextCounter += 1;
      userTypedTextCounter += 1;
    }
    else if (userTypedLetter === "Backspace") {
      alignedTargetText.push("/"); // I put the placeholder instead of the target letter because the backspace is intentional
      alignedUserText.push(userTypedLetter);

      targetTextCounter -= 1;
      userTypedTextCounter += 1;
    }
    else {
      const targetTextOfInterest = targetText.slice(targetTextCounter - maxTextCorrection, targetTextCounter + maxTextCorrection + 1);

      let candidateMergeOffsets: number[] = [];

      for (let targetTextOfInterestCounter = 0; targetTextOfInterestCounter < targetTextOfInterest.length; targetTextOfInterestCounter++) {
        // check if the typed letter can be found in the target text around the predefined range
        if (userTypedLetter === targetTextOfInterest[targetTextOfInterestCounter]) {
          // the index added is normalized to resemble an offset from targetTextCounter
          candidateMergeOffsets.push(targetTextOfInterestCounter - maxTextCorrection);
        }
      }

      let mergeOffset: number = 0;

      if (candidateMergeOffsets.length === 0) {
        mergeOffset = 0; // burts
      }
      else if (candidateMergeOffsets.length === 1) {
        mergeOffset = candidateMergeOffsets[0];
      }
      else {
        // going through each candidate, comparing the letter coming after them with the next user typed letter
        for (let confirmationOffset = 1; confirmationOffset <= maxTextCorrection; confirmationOffset++) {
          let correctCandidateMergeOffsets: number[] = [];

          // this is the letter we need to find
          const nextUserTypedLetter = userTypedText[userTypedTextCounter + confirmationOffset];

          // progressively compare the next user typed letter with the next index from the possibleTextMergeIndices
          for (const index of candidateMergeOffsets) {
            // check if the letters coming after the matched letter are the same
            if (nextUserTypedLetter === targetText[targetTextCounter + index + confirmationOffset]) {
              correctCandidateMergeOffsets.push(index);
            }
          }

          // no matches are present, choosing a random one
          if (correctCandidateMergeOffsets.length === 0) {
            mergeOffset = candidateMergeOffsets[Math.round(Math.random() * candidateMergeOffsets.length)];
            break;
          }
          else if (correctCandidateMergeOffsets.length === 1) {
            mergeOffset = correctCandidateMergeOffsets[0];
            break;
          }
          else {
            // repeat this all over again
            candidateMergeOffsets = [...correctCandidateMergeOffsets];
            confirmationOffset += 1;
          }

        }
      }

      // a b c d e f    target text
      //      \
      // a b x c d e    mergeOffset  = -1
      //
      //
      // a b c d e f    target text
      //        /
      // a b x e d f    mergeOffset  = 1

      if (mergeOffset < 0) {
        // adding placeholders to alignedTargetText
        for (let i = 0; i < Math.abs(mergeOffset); i++) {
          alignedTargetText.push("/");
        }

        for (let i = 0; i < Math.abs(mergeOffset); i++) {
          alignedUserText.push(userTypedText[userTypedTextCounter + i]);
        }

        userTypedTextCounter += Math.abs(mergeOffset);
      }

      else if (mergeOffset > 0) {
        for (let i = 0; i < mergeOffset; i++) {
          alignedUserText.push("/");
        }

        // adding the confirmation letter used to compensate the alignment placeholder
        for (let i = 0; i < Math.abs(mergeOffset); i++) {
          alignedTargetText.push(targetText[targetTextCounter + i]);
        }

        targetTextCounter += mergeOffset;
      }
      else {
        // adding the buffers to the alignedText
        alignedTargetText = alignedTargetText.concat(targetLetter);
        alignedUserText = alignedUserText.concat(userTypedLetter);

        userTypedTextCounter += 1;
        targetTextCounter += 1;
      }
    }
  }

  if (alignedTargetText.length !== alignedUserText.length) {
    console.error(targetText);
    console.error(userTypedText)
    throw "Something went wrong with word alignment!!!";
  }

  return [alignedTargetText, alignedUserText];
}

function constructKeypressData(alignedTargetText: string[], alignedUserTypedText: string[], reversedFingerMap: Map<string, number>) {
  const fingersKeypressData: KeypressData[] = [];

  for (let letterCounter = 0; letterCounter < alignedTargetText.length; letterCounter++) {
    const userTypedLetter = alignedUserTypedText[letterCounter];
    const targetLetter = alignedTargetText[letterCounter];

    // if the key pressed was correct I generate the right data for it and add it to the pool
    const fingerUsed: number = reversedFingerMap.get(userTypedLetter)!;

    const fingerData: KeypressData = {
      targetKey: targetLetter,
      pressedKey: userTypedLetter,
      isCorrect: targetLetter === userTypedLetter,
      position: letterCounter,
      fingerNumber: fingerUsed,
      timeSinceLastKeypress: 0
    }
    fingersKeypressData.push(fingerData);
  }

  return fingersKeypressData;
}

function populateKeypressTimings(keypressData: KeypressData[], keyPressTimings: number[]) {
  let keyPressTimingsCounter = -1;
  let lastKeypressPosition = -1;

  for (const fingerKeypress of keypressData) {
    if (fingerKeypress.pressedKey !== "/") {
      if (fingerKeypress.position === lastKeypressPosition) {
        fingerKeypress.timeSinceLastKeypress = keyPressTimings[keyPressTimingsCounter];
      }
      else {
        keyPressTimingsCounter++;
        lastKeypressPosition = fingerKeypress.position;
        fingerKeypress.timeSinceLastKeypress = keyPressTimings[keyPressTimingsCounter];
      }
    }
  }
}

function generateKeyNeighbourMap(fingerMap: string[][]) {
  let neighbourMap = new Map<string, number>();

  for (let fingerCounter = 0; fingerCounter < fingerMap.length; fingerCounter++) {
    for (const letter of fingerMap[fingerCounter]) {
      if (fingerCounter > 0) {
        neighbourMap.set(letter, fingerCounter - 1);
      }
      if (fingerCounter < fingerMap.length - 1) {
        neighbourMap.set(letter, fingerCounter + 1);
      }

      neighbourMap.set(letter, fingerCounter);
    }
  }
  return neighbourMap;
}