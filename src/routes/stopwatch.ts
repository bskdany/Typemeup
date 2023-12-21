export let msTime :number = 0;
let time :any;
let secondTime :number = 0;
export function startTime(){
    time = setInterval(handleTime, 10);
}

export function stopTime(){
    clearInterval(time)
}

export function resetTime(){
    msTime = 0;
}

function handleTime(){
    msTime+=1;  
}