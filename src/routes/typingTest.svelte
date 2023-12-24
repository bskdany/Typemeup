<script lang="ts">
    import words from "../words/words.json";
    import {recordKeystroke, stopRecordKeystroke} from "./recordKeystrokes";
    import {msTime, resetTime, startTime, stopTime} from "./stopwatch";
    import { onMount, createEventDispatcher } from 'svelte';
    import { wordSize, pressedKeyStore } from "./stores";
    import Configs from "./configs.svelte";

    // let wordsSize :number = 5;
    let wordList :string = "";
    let currentPosition :number = 0;
    let startedTyping :boolean = false;
    let correctCharCount :number = 0;
    let backspaceMinPosition :number = -1;
    let hasMistaken :boolean = false;
    let typingTestWpm :number;
    const dispatch = createEventDispatcher();
    export const resetTypingProp = resetTyping;
    let inputReference :any;
    let configWordSize :number = 10;
    let removableLetters :any= [];

    function generateWords(){

        for(var letter of removableLetters){
            letter.remove();
        }
        removableLetters = [];
        let letters = document.getElementById("main-text")?.getElementsByClassName("letter") as HTMLCollectionOf<HTMLElement>;
        if(letters){
            for(var letter of letters){
                letter.style.color = "rgb(127, 106, 106)";
            }
            wordList = "";
            for(let i = 0; i<configWordSize; i+=1){
                wordList +=(words.words[Math.floor(Math.random()*words.length)]) + " ";
            }
        }
    }

    function handleCursor(movingDirection:number){
        const parentDiv = document.getElementById('main-text');
        const cursor = document.getElementById("cursor");
        const newPosition = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition+movingDirection];
        if(parentDiv && cursor && newPosition){
            parentDiv.insertBefore(cursor, newPosition);
        }
        else{
            console.error("Stop fucking with html")
        }
    }

    function resetCursor(){
        const parentDiv = document.getElementById('main-text');
        const cursor = document.getElementById("cursor");
        const newPosition = document.getElementById("main-text")?.getElementsByClassName("letter")[0];
        if(parentDiv && cursor && newPosition){
            parentDiv.insertBefore(cursor, newPosition);
        }
        else{
            console.error("Stop fucking with html")
        }
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
            typingTestWpm = parseFloat(((correctCharCount / 5 ) * (60/(msTime/100))).toFixed(2));
            stopTime();
            resetTime();
            resetTyping();
            dispatch("typingEnded",typingTestWpm);
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
            recordKeystroke("backspace");
            saveKeyStore("backspace")
            backspace()
        }
        else if(pressedKey){
            const letter = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition];
            const expectedKey = wordList[currentPosition];
            if(letter){
                saveKeyStore(pressedKey);
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
                    if(parent){
                        parent.insertBefore(newLetter, letter);
                    }
                    handleCursor(1);
                    removableLetters = [...removableLetters, newLetter]
                }
            }
            currentPosition+=1;
            checkIfEnd()
        }
    }

    function resetTyping(){
        // reset keystroke recording stuff
        stopRecordKeystroke()
        // reset stopwatch for wpm
        stopTime();
        resetTime();

        generateWords();
        resetCursor();
        // resets the pressed key on keyboard to none
        pressedKeyStore.set("");
        currentPosition = 0;
        startedTyping = false;
        correctCharCount = 0;
        backspaceMinPosition = -1;
        hasMistaken = false;
    }

    function saveKeyStore(key:string){
        pressedKeyStore.set(key);
    }

    onMount(()=>{
        generateWords();
        inputReference.focus();
        wordSize.subscribe(value => { configWordSize=value;resetTyping();});
    })
</script>

<Configs/>
<div role="button" id="typingTest" on:keydown={()=>{}} on:click={inputReference.focus()} tabindex="0">
    <div id="main-text" on:mount>
        <span id="cursor"></span>
        {#each wordList as letter}
            <span class="letter">{letter}</span>
        {/each}
    </div>
    <input bind:this={inputReference} id="wordsInput" on:input={handleTiping}>    
</div>

<style>
    #typingTest{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    #main-text{
        color: rgb(127, 106, 106);
        font-size: 2rem;
        width: 70%;
        user-select: none;
        padding: 50px;
    }
    #wordsInput{
        width: 10%;
        position:absolute;
        background: transparent;
        border: none;
        opacity: none;
        outline: none;
        color: transparent;
        user-select: none;
        cursor: default;
        margin-top: 0%;
    }
    #cursor{
        position:absolute;
        width: 2px;
        height: 2rem;
        background-color: #a8b9e4;
    }
    .letter{
        margin-left: 2px;
    }

</style>