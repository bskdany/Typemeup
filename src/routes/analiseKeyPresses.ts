// there are two possible outcomes, it is right or it is wrong, it is wrong when one letter
// is where it shouldn't be which will make every letter after it wrong too
// in real life it doesn't work like that because single letter mistakes are very common
// mistakes can be either missckick error, reading error or muscle memory error

let msTime = 0;
let keysPressedIndex = 0;
let generatedWords = "";
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
    9: ["p",";","/","backspace"] 
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

// keyPressData stores the actual values
let keyPressData :object[] = [];
// fingerMovementData stores the indices in the keyPressData to the data
let fingerMovementData :any = initialiseFingers();
let keyPressErrors :any = initialiseFingers();

export function initialiseRecording(words :string){
    interval = setInterval(handleTime, 10);
    generatedWords = words;
}

export function recordKeystroke(pressedKey :string, hasMistaken :boolean, expectedKey :string, letterPosition :number){
    const fingerUsed :number = keyToFingerMap[pressedKey];  
    if(!fingerUsed){
        keysPressedIndex += 1;
        return
    }

    let sameFingerMsTimeDifference = 0;
    let sameFingerKeysPressedIndexDifference = 0;
    let averageSameFingerMsTimeDifference = 0;

    const numberOfKeyPressesAtFinger = fingerMovementData[fingerUsed].length;
    if(numberOfKeyPressesAtFinger > 0){
        const sameFingerPreviousKey :any = keyPressData[fingerMovementData[fingerUsed][numberOfKeyPressesAtFinger-1]];
        sameFingerMsTimeDifference = msTime - sameFingerPreviousKey["msTime"];
        sameFingerKeysPressedIndexDifference = keysPressedIndex - sameFingerPreviousKey["keysPressedIndex"];
        averageSameFingerMsTimeDifference = parseFloat((sameFingerMsTimeDifference / sameFingerKeysPressedIndexDifference).toFixed(1));
    }

    const isKeyExpected = expectedKey === pressedKey ? true : false;

    const keyPressAnalisis = {
        "pressedKey" :pressedKey,
        "isCorrect" :!hasMistaken,
        "isKeyExpecterd" :isKeyExpected,
        "expectedKey" :expectedKey,
        "averageSameFingerMsTimeDifference" :averageSameFingerMsTimeDifference,
        "sameFingerMsTimeDifference" :sameFingerMsTimeDifference,
        "sameFingerKeysPressedIndexDifference": sameFingerKeysPressedIndexDifference,
        "keysPressedIndex" :keysPressedIndex,
        "msTime" :msTime,
        "letterIndexInGeneratedWords" :letterPosition,
    }

    fingerMovementData[fingerUsed].push(keysPressedIndex);
    keyPressData.push(keyPressAnalisis);
    keysPressedIndex += 1;
}

export function stopRecordKeystroke(){
    if(msTime > 0){
        console.log(keyPressData);
        analiseMistakes()
        keyPressData = [];
        fingerMovementData = initialiseFingers();
        clearInterval(interval);
        msTime = 0;
        keysPressedIndex = 0;
    }
}

function analiseMistakes(){
    keyPressData.forEach( function(keyPress:any , index :number ){
        const isKeyExpected = keyPress["isKeyExpected"];
        const isCorrect = keyPress["isCorrect"];

        // if the letter is not the last one typed, I need this because I often consider the letter
        // after the one pressed to cathegorise the mistake
        if(index < keyPressData.length - 1){

            if(!isKeyExpected && !isCorrect){
                const nextKeyPress :any = keyPressData[index+1];
                const isNextKeyExpected = keyPress["isKeyExpected"];
                const isNextCorrect = keyPress["isCorrect"];

                const firstPartOfGeneratedText = generatedWords.slice(0, keyPress["letterIndexInGeneratedWords"]+1);
                const lastPartOfGenerateText = generatedWords.slice(keyPress["letterIndexInGeneratedWords"]+1);
                const pressedKey = keyPress["pressedKey"]

                console.log(firstPartOfGeneratedText + `%c${pressedKey}` + `%c${lastPartOfGenerateText}`, "color:red","")

                // finger missed the key and clicked on another one
                if(isNextKeyExpected){
                    console.log("Typed wrong key with data: " , keyPress);
                }            
    
                // finger did not go down enough to press on the key
                // the result is that the pressedkey is the expected key of the next letter
                else if(keyPress["pressedKey"] === nextKeyPress["expectedKey"]){
                    console.log("Mised key: ", keyPress);
                }
    
                else{
                    console.log("Fucking around mistake: ", keyPress);
                }
            }
        }
    
    })
}

function handleTime(){
    msTime+=1;
}