let recordingStarted = false;
let keystrokeData :any = {};
let msTime = 0;
let interval :any;
function startTimer(){
    interval = setInterval(handleTime, 10);
}
function handleTime(){
    msTime+=1;
}
export function stopRecordKeystroke(){
    console.log(keystrokeData);
    clearInterval(interval);
}

export function recordKeystroke(pressedKey :string){
    if(recordingStarted==false){
        startTimer();
        recordingStarted = true;
    }
    keystrokeData[msTime] = pressedKey;
}