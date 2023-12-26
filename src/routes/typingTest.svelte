<script lang="ts">
    import words from "../words/words.json";
    import {recordKeystroke, stopRecordKeystroke} from "./recordKeystrokes";
    import {msTime, resetTime, startTime, stopTime} from "./stopwatch";
    import { onMount, createEventDispatcher } from 'svelte';
    import { wordSize, pressedKeyStore } from "./stores";
    import Configs from "./configs.svelte";

    let wordList :string = "";
    let currentPosition :number = 0;
    let startedTyping :boolean = false;
    let correctCharCount :number = 0;
    let backspaceMinPosition :number = -1;
    let hasMistaken :boolean = false;
    let typingTestWpm :number;
    const dispatch = createEventDispatcher();
    export const resetTypingProp = resetTyping;
    export let inputReference :any;
    let configWordSize :number;
    let removableLetters :any = [];
    let cursorYPositionNew :number = 0;
    let cursorYPositionOld :number = 0;
    let mainTextTranslateDistance :number = 0;

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
        const parentDiv = document.getElementById('main-text').getBoundingClientRect();
        const cursor = document.getElementById("cursor");
        const targetDiv = document.getElementById("main-text")?.getElementsByClassName("letter")[currentPosition+movingDirection].getBoundingClientRect();
        if(parentDiv && cursor && targetDiv){
            const xOffset = targetDiv.left - parentDiv.left;
            const yOffset = targetDiv.top - parentDiv.top;
            cursor.style.transform = `translate(${xOffset-2}px, ${yOffset}px)`;
            cursorYPositionOld = cursorYPositionNew;
            cursorYPositionNew = cursor.getBoundingClientRect().top+yOffset;
            checkIfMoveText()
        }
        else{
            console.error("Stop fucking with html")
        }
    }

    function resetCursor(){
        const cursor = document.getElementById("cursor");
        if(cursor){
            cursor.style.transform = `translate(${0}px, ${0}px)`;
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
                if(pressedKey == " "){
                    saveKeyStore("space");
                    recordKeystroke("space");
                }
                else{
                    saveKeyStore(pressedKey);
                    recordKeystroke(pressedKey);    
                }
                if(pressedKey == expectedKey && !hasMistaken){
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

        var mainText = document.getElementById("main-text");
        mainText.style.marginTop = '0px';

        cursorYPositionNew = 0;
        cursorYPositionOld = 0;
        mainTextTranslateDistance = 0;
    }

    function saveKeyStore(key:string){
        pressedKeyStore.set(key);
    }

    function checkIfMoveText(){
        if(cursorYPositionNew > cursorYPositionOld && !hasMistaken && currentPosition>0){
            const cursorDelta = Math.abs(cursorYPositionNew - cursorYPositionOld);
            var mainText = document.getElementById("main-text");

            const transformArg = mainText?.style.transform;
            const startIndex = transformArg?.indexOf("(");
            const endIndex = transformArg?.indexOf(")");
            if(startIndex && endIndex){
               var valueSubstring = transformArg?.substring(startIndex + 1, endIndex-2);
            }
            if(valueSubstring){
                mainTextTranslateDistance = parseInt(valueSubstring) - cursorDelta;
            }
        }
    }

    onMount(()=>{
        generateWords();
        inputReference.focus();
        wordSize.subscribe(value => { configWordSize=value;resetTyping();});
    })
</script>

<Configs/>
<div role="button" id="typingTest" on:keydown={()=>{}} on:click={inputReference.focus()} tabindex="0">
    <div id="overflow-placeholder">
        <div id="main-text" style="transform: translateY({mainTextTranslateDistance}px">
            <span id="cursor"></span>
            {#each wordList as letter}
                <span class="letter">{letter}</span>
            {/each}
        </div>
    </div>
    <input bind:this={inputReference} id="wordsInput" on:input={handleTiping}>    
</div>

<style>
    #typingTest{
        width: 100%;
        display: flex;
        justify-content: center;
        height: 110px;
    }
    #overflow-placeholder{
        width: 70%;
        height: 100%;
        overflow: hidden;
    }
    #main-text{     
        color: rgb(127, 106, 106);
        width: 100%;
        font-size: 2rem;
        user-select: none;
        transition: transform 0.25s ease-in-out;
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
        margin-top: 3px;
        height: 1em;
        background-color: #a8b9e4;
        transition: transform 0.15s ease-in-out;
    }
    .letter{
        margin-left: 2px;
    }
</style>