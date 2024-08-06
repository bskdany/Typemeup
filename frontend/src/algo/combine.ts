import type { FingerStatistics, FingerKeypressData } from "../types/algo";

export function computeFingersStatistics(fingersStatistics: FingerStatistics[], fingerKeypressData: FingerKeypressData[], fingerMap: string[][]) {
  const separatedFingerKeypressData = separateFingerKeypressDataByFinger(fingerKeypressData, fingerMap.length);
  addKeysToFingersStatistics(fingersStatistics, separatedFingerKeypressData);

  computeNewFingersStatistics(fingersStatistics, separatedFingerKeypressData);

  return fingersStatistics;
}

function separateFingerKeypressDataByFinger(sequentialFingerStatistics: FingerKeypressData[], fignerMapLength: number) {
  const separatedFingerKeypressData: FingerKeypressData[][] = [];
  for (let i = 0; i < fignerMapLength; i++) {
    separatedFingerKeypressData.push([]);
  }
  for (const fingerDataEntry of sequentialFingerStatistics) {
    separatedFingerKeypressData[fingerDataEntry.fingerNumber].push(fingerDataEntry);
  }
  return separatedFingerKeypressData;
}

function addKeysToFingersStatistics(fingersStatistics: FingerStatistics[], fingersKeypressData: FingerKeypressData[][]) {
  for (let i = 0; i < fingersKeypressData.length; i++) {
    fingersStatistics[i].keyPressData.push([]);
    for (const keyPress of fingersKeypressData[i]) {
      const lastIndex = fingersStatistics[i].keyPressData.length - 1;
      fingersStatistics[i].keyPressData[lastIndex].push(keyPress);
    }
  }
}

function computeNewFingersStatistics(fingersStatistics: FingerStatistics[], fingersKeyPressData: FingerKeypressData[][]) {
  for (let i = 0; i < fingersStatistics.length; i++) {
    const FingerStatistics = fingersStatistics[i];
    const fingerKeypressData: FingerKeypressData[] = fingersKeyPressData[i];
    let totalCorrectHitCount = 0;
    let totalWrongHitCount = 0;
    let totalConfidence = 0;
    let totalError = 0;

    for (const keyPress of fingerKeypressData) {
      // e^(-x)
      const keyPressWeightedProbability = parseFloat((Math.pow(Math.E, - keyPress.whenWasLastKeyPressed) * keyPress.probability).toFixed(5));

      if (keyPress.isCorrect) {
        totalConfidence += keyPressWeightedProbability;
        totalCorrectHitCount += 1;
        for (const fingerKeyToKeyMovement of FingerStatistics.keyToKeyMovements) {
          if (fingerKeyToKeyMovement.sourceKey === keyPress.lastFingerPosition && fingerKeyToKeyMovement.destinationKey === keyPress.pressedKey) {
            fingerKeyToKeyMovement.confidence += keyPressWeightedProbability;
            break; // because we will only have 1 match
          }
        }
      }
      else {
        // TODO: questionable approach in using the weighted probability to account for errors
        totalError += keyPressWeightedProbability;
        totalWrongHitCount += 1;
      }
    }
    FingerStatistics.totalCorrectHitCount += totalCorrectHitCount;
    FingerStatistics.totalWrongHitCount += totalWrongHitCount;
    // the condifence is divided by the number of key to key finger movements that each finger can do
    FingerStatistics.totalConfidence = parseFloat((FingerStatistics.totalConfidence + totalConfidence / FingerStatistics.keyToKeyMovements.length).toFixed(5));
    FingerStatistics.totalError = parseFloat((FingerStatistics.totalError + totalError).toFixed(5));

    if (FingerStatistics.totalConfidence + FingerStatistics.totalError != 0) {
      FingerStatistics.accuracy = parseFloat((FingerStatistics.totalCorrectHitCount / (FingerStatistics.totalCorrectHitCount + FingerStatistics.totalWrongHitCount) * 100).toFixed(2));
    }
  }
}

