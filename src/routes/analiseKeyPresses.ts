let msTime = 0;
let interval :any;

// finger map, left pinkie: 0, right pinkie = 9
// map based on https://www.reddit.com/r/learntyping/comments/heypww/why_the_recommended_touch_typing_finger/
// which is the one that I use and that generally makes most sense
const fingerMapping = {
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

// saving last key pressed, new key pressed, difference in time of pressing for same finger
// keys pressed between the two key presses and time between two key presses, this part will make
// it possible to calculate the weight of the finger travel
let fingerMovementData = {};
let keystrokeData :any= {};

export function initialiseRecording(words :string){
    interval = setInterval(handleTime, 10);;
}

export function recordKeystroke(pressedKey :string, hasMistaken :boolean){
    keystrokeData[msTime] = {"pressedKey":pressedKey, "isCorrect": !hasMistaken};
}

export function stopRecordKeystroke(){
    if(Object.keys(keystrokeData).length > 0){
        console.log(keystrokeData)

        calculateFingerTravel();
        
        clearInterval(interval);
        keystrokeData = {};
    }
    msTime = 0;
}

function calculateFingerTravel(){
    let fingerKeyPresses :any = [];
    let keysPressedBetweenLastTwo = 0;
    for(const [msTime, keyPressData] of Object.entries(keystrokeData)){
        if(fingerMapping[3].includes(keyPressData.pressedKey)){
            fingerKeyPresses.push({
                msTime: msTime,
                pressedKey: keyPressData.pressedKey,
                isCorrect: keyPressData.isCorrect,
                keysPressedBetweenLastTwo: keysPressedBetweenLastTwo,
            })
            keysPressedBetweenLastTwo = 0;
        }
        else{
            keysPressedBetweenLastTwo +=1;
        }
    }
    console.log(fingerKeyPresses)
}

function handleTime(){
    msTime+=1;
}