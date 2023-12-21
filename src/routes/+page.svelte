<script lang="ts">
    import words from "../words/words.json";
    import {recordKeystroke} from "./recordKeystrokes";
    import {msTime, resetTime, startTime, stopTime} from "./stopwatch";
    import { onMount } from 'svelte';

    let wordsSize = 5;
    let wordList = "";
    let currentPosition = 0;
    let startedTyping = false;
    let correctCharCount = 0;
    let backspaceMinPosition = -1;
    let hasMistaken = false;

    function generateWords(){
        let letters = document.getElementById("main-text")?.getElementsByClassName("letter");
        for(var letter of letters){
            letter.style.color = "rgb(127, 106, 106)";
        }
        wordList = "";
        for(let i = 0; i<wordsSize; i+=1){
            wordList +=(words.words[Math.floor(Math.random()*words.length)]) + " ";
        }
    }

    function handleCursor(movingDirection:number){
        const parentDiv = document.getElementById('main-text');
        const cursor = document.getElementById("cursor");
        const newPosition = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition+movingDirection];
        parentDiv.insertBefore(cursor, newPosition);
    }

    function resetCursor(){
        const parentDiv = document.getElementById('main-text');
        const cursor = document.getElementById("cursor");
        const newPosition = document.getElementById("main-text")?.getElementsByClassName("letter")[0];
        parentDiv.insertBefore(cursor, newPosition);
    }

    function backspace(){
        if(currentPosition == 0){
            return
        }
        const letter = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition-1];

        handleCursor(-1)
        if(letter){
            if(letter.classList.contains("removable")){
                letter.remove();

                const previousLetter = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition-2];
                if(currentPosition==1 || previousLetter?.style?.color == "white"){
                    hasMistaken=false;
                }
            }
            else{
                correctCharCount-=1;
                letter.style.color= "rgb(127, 106, 106)";
            }
        }
        currentPosition -=1;
    }

    function checkIfEnd(){
        if(currentPosition==wordList.length-1 && !hasMistaken){
            console.log(`Correct chars: ${correctCharCount}`)
            console.log(`time: ${msTime}`)
            const wpmSpeed = ((correctCharCount / 5 ) * (60/(msTime/100))).toFixed(2);
            stopTime();
            resetTime()
            console.log(wpmSpeed)
            resetTyping();
        }
    }

    function handleTiping(keydown:any){
        const pressedKey = keydown.data;
        if(!startedTyping){
            startedTyping = true;
            resetTime()
            startTime()
        }

        if(keydown.inputType=="deleteContentBackward" && currentPosition > backspaceMinPosition+1){
            recordKeystroke("backspace")
            backspace()
        }
        else if(pressedKey){
            const letter = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition];
            const expectedKey = wordList[currentPosition];
            if(letter){
                if(pressedKey == expectedKey && !hasMistaken){
                    recordKeystroke(pressedKey);
                    letter.style.color= "white";
                    handleCursor(1);
                    correctCharCount+=1;

                    if(pressedKey==" "){
                        backspaceMinPosition = currentPosition;
                    }
                }

                else{
                    hasMistaken = true;
                    let newLetter = letter.cloneNode()
                    newLetter.textContent=pressedKey;
                    newLetter.classList.add("removable");
                    newLetter.style.color = "red";
                    const parent = document.getElementById("main-text")
                    parent.insertBefore(newLetter, letter);
                    handleCursor(1)
                }
            }
            currentPosition+=1;
            checkIfEnd()
        }
    }

    function resetTyping(){
        generateWords();
        stopTime();
        resetTime();
        resetCursor();
        currentPosition = 0;
        startedTyping = false;
        correctCharCount = 0;
        backspaceMinPosition = -1;
        hasMistaken = false;
    }

    function handleKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            resetTyping();
        }
    }

    function resetLetterToDefaultColor(letter){
        console.log("value changed")
        letter.style.color = rgb(127, 106, 106);
    }

    onMount(()=>{
        generateWords();
    })

</script>

<div id=""></div>
<div id="main-text" on:mount>
    <span id="cursor"></span>
    {#each wordList as letter}
        <span class="letter">{letter}</span>
    {/each}
</div>
<input id="wordsInput" on:input={handleTiping} on:keydown={handleKeyDown}>

<style>
    :global(body){
        background-color: #323437;
        font-family: Arial, Helvetica, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100lvh;
        flex-direction: column;
    }
    :global(footer){
        display: none;
    }
    #main-text{
        color: rgb(127, 106, 106);
        font-size: 2rem;
        width: 80%;
        user-select: none;
    }
    #wordsInput{
        width: 80%;
        height: 100px;
        position:absolute;
        background: transparent;
        border: none;
        opacity: none;
        outline: none;
        color: transparent;
        user-select: none;
        cursor: default;
    }
    #cursor{
        position:absolute;
        width: 2px;
        height: 2rem;
        background-color: rgb(172, 209, 79);
    }
    .letter{
        margin-left: 2px;
    }

</style>



