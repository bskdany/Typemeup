export let msTime :number = 0;
let time :any;
export function startTime(){
    time = setInterval(handleTime, 1);
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