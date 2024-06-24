import type { FingerKeyToKeyMovement, FingerStatistics } from "../interfaces";

export function initializeFingersStatistics(fingerMap: string[][]) {

    const fingersStatistics: FingerStatistics[] = [];

    for (let i = 0; i < fingerMap.length; i++) {

        const fingerKeyToKeyMovement: FingerKeyToKeyMovement[] = [];
        const keySet = fingerMap[i];

        for (const sourceKey of keySet) {
            for (const destinationKey of keySet) {
                fingerKeyToKeyMovement.push({
                    sourceKey: sourceKey,
                    destinationKey: destinationKey,
                    confidence: 0
                })
            }
        }

        fingersStatistics.push({
            fingerNumber: i,
            keyPressData: [],
            keyToKeyMovements: [...fingerKeyToKeyMovement],
            totalCorrectHitCount: 0,
            totalWrongHitCount: 0,
            totalConfidence: 0,
            totalError: 0,
            accuracy: 0
        });
    }

    return fingersStatistics;
}