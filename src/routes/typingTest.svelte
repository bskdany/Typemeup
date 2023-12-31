<script lang="ts">
    import words from "../words/words.json";
    import {recordKeystroke, stopRecordKeystroke} from "./recordKeystrokes";
    import { onMount, createEventDispatcher } from 'svelte';
    import { wordSizeStore, pressedKeyStore, typingTestModeStore, typingTestTimeStore} from "./stores";
    import Configs from "./configs.svelte";
    import TypingProgress from "./typingProgress.svelte";

    // from stores
    let configWordSize :number;
    let configTestMode :string;
    let configTestTime :number;

    // for handling time
    let msTime :number = 0; 
    let secondsTime :number = 0;
    let timeInterval :any; // to record the time 

    let generatedWords :string[];
    let mainText :object[][] = [];
    
    let globalLetterIndex :number = 0;
    let currentWordIndex :number = 0;
    let letterIndexInWord :number = 0;

    let startedTyping :boolean = false;
    let correctCharCount :number = 0;
    let backspaceMinPosition :number = -1; // the minimin position in the array to which the user can backspace
    let hasMistaken :boolean = false;
    let typingTestWpm :number;
    let removableLetters :any = [];
    let cursorYPositionNew :number = 0;
    let cursorYPositionOld :number = 0;
    let mainTextTranslateDistance :number = 0;
    let wordsTyped = 0;

    const dispatch = createEventDispatcher();
    export const resetTypingProp = resetTyping;
    export let inputReference :any;

    function setLetterProperty(wordIndex :number, letterIndex :number, property :string, value :any){
        if(mainText && mainText.length > 0){
            if(Object.keys(mainText[wordIndex][letterIndex]).includes(property)){
                mainText[wordIndex][letterIndex][property] = value;                
            }
        }
    }


    function createMainText(){
        generatedWords = [];
        for(let i = 0; i < (configTestMode === "time" ? 100 : configWordSize); i+=1){
            generatedWords.push(words.words[Math.floor(Math.random()*words.length)]);
        }

        mainText = [];
        let letterIdCounter = 0;
        for(const word of generatedWords){
            let letterElements = [];
            for(let i = 0; i < word.length; i++){
                const letterElement = {
                    id: letterIdCounter,
                    value: word.charAt(i),
                    typed: false,
                    removable: false,
                }
                letterElements.push(letterElement);
                letterIdCounter += 1;
            }
            // mainText = [...mainText, letterElements];
            mainText.push(letterElements);
        }
        setLetterProperty(0,0,"typed",true);
    }

    function handleCursor(movingDirection:number){
        const mainText = document.getElementById('main-text');
        const ghostCursor = document.getElementById("cursor");
        const newPosition = mainText?.getElementsByClassName("letter")[currentPosition+movingDirection];
        if(mainText && ghostCursor && newPosition){
            mainText.insertBefore(ghostCursor, newPosition);

            const ghostCursorClientRect = ghostCursor.getBoundingClientRect();
            const mainTextClientRect = mainText.getBoundingClientRect();

            cursorYPositionOld = cursorYPositionNew;
            cursorYPositionNew = ghostCursorClientRect.top;

            // const cursor = document.getElementById("cursor");
            // if(cursor){
            //     const xOffset = ghostCursorClientRect.left - mainTextClientRect.left;
            //     const yOffset = ghostCursorClientRect.top - mainTextClientRect.top;
            //     cursor.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            // }
            checkIfMoveText();
        }
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
        if(configTestMode==="words"){
            if(currentPosition==generatedWords.length-1 && !hasMistaken){
                typingTestWpm = parseFloat(((correctCharCount / 5 ) * (60/(msTime/1000))).toFixed(2));
                dispatch("typingEnded",typingTestWpm);
                resetTyping();
            }
        }     
    }

    function handleTiping(keydown:any){
        const pressedKey = keydown.data;
        if(!startedTyping){
            startedTyping = true;
            msTime = 0;
            timeInterval = setInterval(handleTime, 10);
        }

        if(keydown.inputType=="deleteContentBackward" && currentPosition > backspaceMinPosition+1){
            recordKeystroke("backspace");
            saveKeyStore("backspace");
            backspace();
        }

        else if(pressedKey){
            const expectedKey = generatedWords[currentPosition];
            
            if(pressedKey === " "){
                saveKeyStore("space");
                recordKeystroke("space");
            }
            else{
                saveKeyStore(pressedKey);
                recordKeystroke(pressedKey);    
            }

            if(pressedKey === expectedKey && !hasMistaken){
                letter.style.color= "white";
                handleCursor(1);
                correctCharCount+=1;

                if(pressedKey==" "){
                    backspaceMinPosition = currentPosition;
                    wordsTyped += 1;
                }
            }

            else{
                hasMistaken = true;
                let newLetter = document.createElement('span');
                if(pressedKey !== " "){
                    newLetter.textContent = pressedKey;
                }
                else{
                    newLetter.textContent = "_";
                }
                newLetter.classList.add("removable");
                newLetter.classList.add("letter");
                newLetter.style.color = "red";
                const parent = document.getElementById("main-text")
                if(parent){
                    parent.insertBefore(newLetter, letter);
                }
                handleCursor(1);
                removableLetters = [...removableLetters, newLetter]
            }
            
            currentPosition+=1;
            checkIfEnd()
        }
    }

    function resetTyping(){

        // reset keystroke recording stuff
        stopRecordKeystroke();
        // reset stopwatch for wpm
        msTime = 0;
        secondsTime = 0;
        clearInterval(timeInterval)

        createMainText();
        resetCursor();
        // resets the pressed key on keyboard to none
        removableLetters = [];
        pressedKeyStore.set("");
        currentPosition = 0;
        startedTyping = false;
        correctCharCount = 0;
        backspaceMinPosition = -1;
        hasMistaken = false;
        wordsTyped = 0;

        const mainText = document.getElementById("main-text");
        if(mainText){
            mainText.style.marginTop = '0px';
        }
        cursorYPositionNew = 0;
        cursorYPositionOld = 0;
        mainTextTranslateDistance = 0;
    }

    function saveKeyStore(key:string){
        pressedKeyStore.set(key);
    }

    function checkIfMoveText(){
        const cursorDelta = cursorYPositionNew - cursorYPositionOld;
        if(cursorDelta > 16 && !hasMistaken && currentPosition>0){
            // generatedWords = generatedWords.slice(currentPosition);
            // resetCursor();
            // let letters = document.getElementById("main-text")?.getElementsByClassName("letter") as HTMLCollectionOf<HTMLElement>;
            // if(letters){
            //     for(var letter of letters){
            //         letter.style.color = "rgb(127, 106, 106)";
            //     }
            // }

            // currentPosition = 0;

            // console.log(cursorYPositionOld + " " + cursorYPositionNew)

            const overflowPlaceholder = document.getElementById("overflow-placeholder");
            const overFlowPlaceholderHeight = overflowPlaceholder.getBoundingClientRect().top - overflowPlaceholder.getBoundingClientRect().bottom;
            console.log(overFlowPlaceholderHeight / 3)

            var mainText = document.getElementById("main-text");
            const transformArg = mainText?.style.transform;
            const startIndex = transformArg?.indexOf("(");
            const endIndex = transformArg?.indexOf(")");
            if(startIndex && endIndex){
               var valueSubstring = transformArg?.substring(startIndex + 1, endIndex-2);
            }
            console.log(valueSubstring)
            if(valueSubstring){
                mainTextTranslateDistance = parseFloat(valueSubstring) -36;
            }
        }
    }

    // part that handles time
    function handleTime(){
        msTime+=10;
        if(msTime%1000==0){
            secondsTime +=1;
        }

        if(configTestMode === "time" && msTime > configTestTime*1000){
            typingTestWpm = parseFloat(((correctCharCount / 5 ) * (60/(msTime/1000))).toFixed(2));
            clearInterval(timeInterval);
            msTime = 0;
            dispatch("typingEnded",typingTestWpm);
            resetTyping();
        }
    }

    onMount(()=>{
       createMainText();
        inputReference.focus();
        typingTestModeStore.subscribe(value => {
            configTestMode=value;
            resetTyping();
        });
        wordSizeStore.subscribe(value => { 
            configWordSize=value;
            resetTyping();
        });
        typingTestTimeStore.subscribe(value => { configTestTime=value; resetTyping()});
       createMainText();
    })    
</script>

<div id="statusBar">
    {#if startedTyping}
    <div id="typingProgress">  
        <TypingProgress wordsTyped={wordsTyped} timeTyped={secondsTime}/>
    </div>
    {/if}
    <div id="configs"> 
        <Configs/>
    </div>
</div>


<div role="button" id="typingTest" on:keydown={()=>{}} on:click={inputReference.focus()} tabindex="0">
    <div id="overflow-placeholder">
        <div id="main-text" style="transform: translateY({mainTextTranslateDistance}px">
            <div id="cursor"></div>
            {#each mainText as word}
                <div class="word">
                    {#each word as {id, value, typed, removable}}
                        <span 
                            class="letter 
                                {typed === true ? "typed" : ""} 
                                {removable === true ? "removable" : ""}"
                            id="letter{id}">
                            {value}
                        </span>
                    {/each}
                </div>
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
        height: 112px; 
    }
    #overflow-placeholder{
        width: 70%;
        height: 100%;
        overflow: hidden;
    }
    #main-text{    
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        color: rgb(127, 106, 106);
        width: 100%;
        font-size: 2rem;
        user-select: none;
        transition: transform 0.25s ease-in-out;
    }
    #cursor{
        position: absolute;
        height: 2rem;
        width: 2px;
        /* background-color: transparent; */
        background-color: #a8b9e4;
    }
    #wordsInput{
        pointer-events: none;
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
    .letter{
        margin-left: 2px;
    }
    #statusBar{
        width: 70%;
        display: grid;
    }
    #typingProgress{
        position: absolute;
        align-self: end;
        margin-bottom: 10px;
    }
    #configs{
       margin: auto;
       align-items: center;
    }
    
    @media only screen and (max-width: 767px) {
        #statusBar{
            width: 90%;
        }
        #overflow-placeholder{
            width: 90%;
        }
    }
</style>