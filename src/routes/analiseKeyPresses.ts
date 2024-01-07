// there are two possible outcomes, it is right or it is wrong, it is wrong when one letter
// is where it shouldn't be which will make every letter after it wrong too
// in real life it doesn't work like that because single letter mistakes are very common
// mistakes can be either missckick error, reading error or muscle memory error

let msTime = 0;
let keysPressIndex = 0;
let interval :any;

// finger map, left pinkie: 0, right pinkie = 9
// map based on https://www.reddit.com/r/learntyping/comments/heypww/why_the_recommended_touch_typing_finger/
// which is the one that I use and that generally makes most sense
const fingerToKeyMap = {
    0: ["q","a"],
    1: ["w","s","d"],
    2: ["e","d","x"],
    3: ["r","f","c","t","g","v"],
    4: ["space"], // what a waste right? considering its the main typing finger on the smartphone
    5: ["space"], 
    6: ["y","h","b","u","j","n","m"],
    7: ["i","k",","],
    8: ["o","l","."],
    9: ["p",";","/"] 
} 

function reverseFingerToKeyMap(){
    let keyToFingerIndex :any = {};
    for(const [finger, keys] of Object.entries(fingerToKeyMap)){
        for(const key of keys){
            keyToFingerIndex[key] = finger;
        }
    }
    return keyToFingerIndex;
}

const keyToFingerMap = reverseFingerToKeyMap()

// saving last key pressed, new key pressed, difference in time of pressing for same finger
// keys pressed between the two key presses and time between two key presses, this part will make
// it possible to calculate the weight of the finger travel
function initialiseFingers(){
    return {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [], 
        6: [],
        7: [],
        8: [],
        9: [] 
    };
}

let fingerMovementData :any = initialiseFingers();
let keyPressData :any = initialiseFingers();

export function initialiseRecording(words :string){
    interval = setInterval(handleTime, 10);;
}

export function recordKeystroke(pressedKey :string, hasMistaken :boolean){
    const fingerUsed :number = keyToFingerMap[pressedKey];  
    if(!fingerUsed){
        return
    }

    let msTimeDifference = 0;
    let keysPressIndexDifference = 0;
    const numberOfKeyPressesAtFinger = keyPressData[fingerUsed].length;
    if(numberOfKeyPressesAtFinger > 0){
        msTimeDifference = msTime - keyPressData[fingerUsed][numberOfKeyPressesAtFinger-1]["msTime"];
        keysPressIndexDifference = keysPressIndex - keyPressData[fingerUsed][numberOfKeyPressesAtFinger-1]["keyPressIndex"] - 1;
    }

    keyPressData[fingerUsed].push({
        "pressedKey" :pressedKey,
        "isCorrect" :!hasMistaken,
        "msTimeDifference" :msTimeDifference,
        "keysPressIndexDifference": keysPressIndexDifference,
        "keyPressIndex" :keysPressIndex,
        "msTime" :msTime,
    })

    keysPressIndex += 1;
}

export function stopRecordKeystroke(){
    if(msTime > 0){
        console.log(keyPressData)
        keyPressData = initialiseFingers();
        clearInterval(interval);
        msTime = 0;
        keysPressIndex = 0;
    }
}

function calculateFingerMovement(){

}


// function calculateFingerTravel(){
//     let fingergetMovementData = {
//         0: [],
//         1: [],
//         2: [],
//         3: [],
//         4: [],
//         5: [], 
//         6: [],
//         7: [],
//         8: [],
//         9: [] 
//     };

//     for(const [msTime, keyPressData] of Object.entries(keystrokeData)){
//         const usedFinger = fingerMapping[]


//         if(fingerMapping[3].includes(keyPressData.pressedKey)){
//             fingerKeyPresses.push({
//                 msTime: msTime,
//                 pressedKey: keyPressData.pressedKey,
//                 isCorrect: keyPressData.isCorrect,
//                 keysPressedBetweenLastTwo: keysPressedBetweenLastTwo,
//             })
//         }
//     }
//     // console.log(fingerKeyPresses)
// }

function handleTime(){
    msTime+=1;
}