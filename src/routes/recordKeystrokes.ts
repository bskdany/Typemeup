let recordingStarted = false;
let keystrokeData = {};
let msTime = 0;
let interval :any;
function startTimer(){
    interval = setInterval(handleTime, 10);
}
function handleTime(){
    msTime+=1;
}
function stopTimer(){
    clearInterval(interval)
}

export function recordKeystroke(keystroke :string){
    if(recordingStarted==false){
        startTimer();
        recordingStarted = true;
    }
    // console.log(keystroke + " " + msTime)
}