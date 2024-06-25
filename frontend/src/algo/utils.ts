export function splitArray<T>(array: T[], delimiter: T): T[][] {
    const result: T[][] = [];
    let currentPart: T[] = [];

    array.forEach(element => {
        if (element === delimiter) {
            if (currentPart.length > 0) {
                result.push(currentPart);
                currentPart = [];
            }
        } else {
            currentPart.push(element);
        }
    });

    // Push the last part if it is not empty
    if (currentPart.length > 0) {
        result.push(currentPart);
    }

    return result;
}