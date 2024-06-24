import type { FingerKeypressData, FingerKeyToKeyMovement, FingerStatistics, TypingAnalysisError, UserTypedText } from "../interfaces";


export function analyse(fingersStatistics: FingerStatistics[], targetText: string[], userTypedText: string[], fingerMap: string[][], reversedFingerMap: Map<string, number>, defaultFingerPositions: string[]) {
    const [alignedTargetText, alignedUserTypedText] = alignText(targetText, userTypedText);

    console.log(targetText)
    console.log("Original text  " + targetText.join(""));
    console.log("               " + userTypedText.join(""));

    console.log("Aligned text   " + alignedTargetText.join(""));
    console.log("               " + alignedUserTypedText.join(""));

    const sequentialFingerKeypressData = generateFingerData(alignedTargetText, alignedUserTypedText, fingerMap, reversedFingerMap, defaultFingerPositions);
    console.log(sequentialFingerKeypressData)
    calculateWhenWasLastKeyPressedSameFinger(sequentialFingerKeypressData, fingerMap.length);
    const fingerKeypressData: FingerKeypressData[][] = divideDataByFinger(sequentialFingerKeypressData, fingerMap.length);

    addKeysToFingersStatistics(fingersStatistics, fingerKeypressData);
    updateStatistics(fingersStatistics, fingerKeypressData);
    return fingersStatistics;
}

function updateStatistics(fingersStatistics: FingerStatistics[], fingersKeyPressData: FingerKeypressData[][]) {
    for (let i = 0; i < fingersStatistics.length; i++) {
        const fingerStatistics = fingersStatistics[i];
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
                for (const fingerKeyToKeyMovement of fingerStatistics.keyToKeyMovements) {
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
        fingerStatistics.totalCorrectHitCount += totalCorrectHitCount;
        fingerStatistics.totalWrongHitCount += totalWrongHitCount;
        // the condifence is divided by the number of key to key finger movements that each finger can do
        fingerStatistics.totalConfidence = parseFloat((fingerStatistics.totalConfidence + totalConfidence / fingerStatistics.keyToKeyMovements.length).toFixed(5));
        fingerStatistics.totalError = parseFloat((fingerStatistics.totalError + totalError).toFixed(5));

        if (fingerStatistics.totalConfidence + fingerStatistics.totalError != 0) {
            fingerStatistics.accuracy = parseFloat((fingerStatistics.totalCorrectHitCount / (fingerStatistics.totalCorrectHitCount + fingerStatistics.totalWrongHitCount) * 100).toFixed(2));
        }
    }
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

function calculateFingerAccuracy(fingerKeypressData: FingerKeypressData[][], fingerMap: string[][]) {
    const currentFingerAccuracy: number[] = Array(fingerMap.length).fill(0);
    for (let i = 0; i < fingerKeypressData.length; i++) {
        let cumulativeCorrect = 0;
        let cumulativeWrong = 0;
        for (let keyPress of fingerKeypressData[i]) {
            if (keyPress.isCorrect) {
                cumulativeCorrect += keyPress.probability;
            }
            else {
                cumulativeWrong += keyPress.probability;
            }
        }
        if (cumulativeCorrect + cumulativeWrong != 0) {
            const accuracy = 100 / (cumulativeCorrect + cumulativeWrong) * cumulativeCorrect;
            currentFingerAccuracy[i] = parseFloat(accuracy.toFixed(2));
        }
    }
    return currentFingerAccuracy;
}

function calculateWhenWasLastKeyPressedSameFinger(sequentialFingerData: FingerKeypressData[], fingerMapLength: number) {
    const currentFingerPositionLastKeyPressed: number[] = new Array(fingerMapLength).fill(0);

    for (const fingerDataEntry of sequentialFingerData) {
        fingerDataEntry.whenWasLastKeyPressed = currentFingerPositionLastKeyPressed[fingerDataEntry.fingerNumber];

        if (fingerDataEntry.isCorrect) {
            currentFingerPositionLastKeyPressed[fingerDataEntry.fingerNumber] = -1;
            for (let i = 0; i < currentFingerPositionLastKeyPressed.length; i++) {
                currentFingerPositionLastKeyPressed[i] += 1;
            }
        }
    }
}

function divideDataByFinger(sequentialFingerData: FingerKeypressData[], fignerMapLength: number) {
    const fingerDataByFinger: FingerKeypressData[][] = [];
    for (let i = 0; i < fignerMapLength; i++) {
        fingerDataByFinger.push([]);
    }
    for (const fingerDataEntry of sequentialFingerData) {
        fingerDataByFinger[fingerDataEntry.fingerNumber].push(fingerDataEntry);
    }
    return fingerDataByFinger;
}

function calculateFingerProbability(error: TypingAnalysisError, fingerMapLength: number, reversedFingerMap: Map<string, number>) {
    let firstKeyFinger: number = -1;
    if (error.pressedKeys[0] != "") {
        firstKeyFinger = reversedFingerMap.get(error.pressedKeys[0])!;
    }

    let lastKeyFinger: number = -1;
    if (error.pressedKeys[error.pressedKeys.length - 1] != "") {
        lastKeyFinger = reversedFingerMap.get(error.pressedKeys[error.pressedKeys.length - 1])!;
    }

    let availableFingers: number[] = [];
    // get the target fingers
    for (const targetKey of error.targetKeys) {
        if (targetKey != "/" && targetKey != "") {
            const fingerUsed = reversedFingerMap.get(targetKey)!;
            if (!availableFingers.includes(fingerUsed)) {
                availableFingers.push(fingerUsed);
            }
        }
    }

    const fingerProbabilities: number[][] = [];

    error.pressedKeys.forEach((pressedKey, index) => {
        if (index == 0 || index == error.pressedKeys.length - 1) {
            return;
        }

        const fingerProbability: number[] = Array(fingerMapLength).fill(0);

        const targetKey = error.targetKeys[index];
        const targetFinger = reversedFingerMap.get(targetKey)!;
        if (pressedKey == "/") {
            fingerProbability[targetFinger] = 1;
            fingerProbabilities.push(fingerProbability);
            return;
        }

        const defaultFingerForKey = reversedFingerMap.get(pressedKey)!;
        const possibleFingers: number[] = [defaultFingerForKey]

        if (defaultFingerForKey > 0) {
            possibleFingers.unshift(defaultFingerForKey - 1);
        }
        if (defaultFingerForKey < fingerMapLength - 1) {
            possibleFingers.push(defaultFingerForKey + 1);
        }

        let totalWeight: number = 0;
        const fingerWeights: number[] = Array(fingerMapLength).fill(0);

        // smoothing out the probability by adding initial weights for each finger
        for (const finger of possibleFingers) {
            fingerWeights[finger] = 1;
            totalWeight += 1;
        }

        for (const possibleFinger of possibleFingers) {
            for (const availableFinger of availableFingers) {
                if (possibleFinger == availableFinger) {
                    fingerWeights[availableFinger] += 1;
                    totalWeight += 1;
                }
            }
        }

        fingerWeights.forEach((fingerWeight, fingerIndex) => {
            if (fingerWeight != 0) {
                fingerProbability[fingerIndex] = fingerWeight / totalWeight;
            }
        })

        fingerProbabilities.push(fingerProbability);

        let probabilityText = "Extra click on key " + pressedKey;
        fingerProbability.forEach((probability, finger) => {
            if (probability != 0) {
                probabilityText += " finger " + finger + " " + Math.round(probability * 100) + "%"
            }
        })
    })

    return fingerProbabilities;
}

function generateFingerData(alignedTargetText: string[], alignedUserTypedText: string[], fingerMap: string[][], reversedFingerMap: Map<string, number>, defaultFingerPositions: string[]) {
    const currentFingerPosition: string[] = [...defaultFingerPositions];

    const sequentialFingerData: FingerKeypressData[] = [];

    for (let letterCounter = 0; letterCounter < alignedTargetText.length; letterCounter++) {
        let letterCounterJumpAmount = 0; // this is needed in case I have 2 placeholders in a row
        const userTypedLetter = alignedUserTypedText[letterCounter];
        const targetLetter = alignedTargetText[letterCounter];

        if (userTypedLetter != targetLetter) {
            const lastKeyPressed = alignedUserTypedText[letterCounter - 1] ? alignedUserTypedText[letterCounter - 1] : "";

            const targetKeys: string[] = [lastKeyPressed];
            const userTypedKeys: string[] = [lastKeyPressed];

            // find the next time that the letters are the same (or text finished)
            for (let confirmationLetterCounter = letterCounter; confirmationLetterCounter < alignedTargetText.length; confirmationLetterCounter++) {
                const nextTargetLetter = alignedTargetText[confirmationLetterCounter];
                const nextUserTypedLetter = alignedUserTypedText[confirmationLetterCounter];

                userTypedKeys.push(nextUserTypedLetter);
                targetKeys.push(nextTargetLetter);

                if (confirmationLetterCounter == alignedTargetText.length - 1) {
                    userTypedKeys.push("");
                    targetKeys.push("");
                }

                if (nextUserTypedLetter != nextTargetLetter) {
                    letterCounterJumpAmount += 1;
                }
                else {
                    letterCounterJumpAmount -= 1; // to compensate the offset of the first added letter
                    break;
                }
            }

            const error: TypingAnalysisError = {
                targetKeys: targetKeys,
                pressedKeys: userTypedKeys,
                fingerConfiguration: [...currentFingerPosition],
                positionIndex: letterCounter
            }

            const fingerProbabilities: number[][] = calculateFingerProbability(error, fingerMap.length, reversedFingerMap);

            fingerProbabilities.forEach((fingerProbability, errorKeyIndex) => {
                fingerProbability.forEach((probability, fingerUsed) => {
                    if (probability > 0) {
                        const targetLetterError = alignedTargetText[letterCounter + errorKeyIndex];
                        const userTypedLetterError = alignedUserTypedText[letterCounter + errorKeyIndex];
                        const lastKeyPressed: string = currentFingerPosition[fingerUsed];
                        const isBurst = userTypedKeys.length - 2 > 3;

                        const fingerData: FingerKeypressData = {
                            isCorrect: false,
                            probability: probability,
                            lastFingerPosition: lastKeyPressed,
                            targetKey: targetLetterError,
                            pressedKey: userTypedLetterError,
                            errorType: 1,
                            position: letterCounter,
                            fingerNumber: fingerUsed,
                            isBurts: isBurst,
                            whenWasLastKeyPressed: 0
                        }

                        sequentialFingerData.push(fingerData);
                    }
                })

                //if (userTypedLetter != "/") {
                //  currentFingerPosition[reversedFingerMap.get(userTypedLetter)!] = userTypedLetter;
                //}

            })
        }
        // if the key pressed was correct I generate the right data for it and add it to the pool
        else {
            const fingerUsed: number = reversedFingerMap.get(userTypedLetter)!;
            const lastKeyPressed: string = currentFingerPosition[fingerUsed];

            const fingerData: FingerKeypressData = {
                isCorrect: true,
                probability: 1,
                lastFingerPosition: lastKeyPressed,
                targetKey: targetLetter,
                pressedKey: userTypedLetter,
                errorType: 0,
                position: letterCounter,
                fingerNumber: fingerUsed,
                isBurts: false,
                whenWasLastKeyPressed: 0
            }

            sequentialFingerData.push(fingerData);

            // update the finger position
            currentFingerPosition[reversedFingerMap.get(userTypedLetter)!] = userTypedLetter;

        }

        letterCounter += letterCounterJumpAmount;
    }

    return sequentialFingerData;
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
        throw "Something went wrong with word alignment!!!";
    }

    return [alignedTargetText, alignedUserText];
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