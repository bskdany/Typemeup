<script lang="ts">
    import words from "../words/words.json";
    import {initialiseRecording, recordKeystroke, stopRecordKeystroke} from "../scripts/analiseKeyPresses";
    import { onMount, createEventDispatcher } from 'svelte';
    import { wordSizeStore, pressedKeyStore, typingTestModeStore, typingTestTimeStore} from "../scripts/stores";
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

    // element binds
    let mainText :object[][] = [];      
    let mainTextElement :HTMLElement; 
    let wordElements :HTMLElement[] = [];
    let cursorElement :HTMLElement;
    export let inputReference :HTMLElement;

    let generatedWords :string = "";
    let globalLetterIndex :number = 0;
    let currentWordIndex :number = 0;
    let currentLetterIndex :number = 0;
    let cursorElementPosition = {x: 0, y: 0};
    let startedTyping :boolean = false;
    let showDebugging :boolean = false;
    let hasMistaken :boolean = false;
    let cancelTransitionCursor :boolean = false;
    let correctCharCount :number = 0;
    let backspaceMinPosition :number = -1; // the minimin position in the letters array to which the user can backspace
    let mainTextTranslateDistance :number = 0;
    
    let resizeObserver;     // to handle mainText resizing
    const dispatch = createEventDispatcher();
    export const resetTypingProp = resetTyping;

    function setLetterProperty(wordIndex :number, letterIndex :number, property :string, value :any){
        if(mainText && mainText.length > 0){
            if(Object.keys(mainText[wordIndex][letterIndex]).includes(property)){
                mainText[wordIndex][letterIndex][property] = value;                
            }
        }
    }

    function handleTime(){
        msTime += 10;
        if(msTime % 1000 === 0){
            secondsTime += 1;
        }
        if(configTestMode === "time" && msTime > configTestTime * 1000){
            const typingTestWpm = calculateWPM();
            dispatch("typingEnded",typingTestWpm);
            resetTyping();
        }
    }
    
    function calculateWPM(){
        return parseFloat(((correctCharCount / 5 ) * (60/(msTime/1000))).toFixed(2));
    }

    function createMainText(){
        generatedWords = "";
        for(let i = 0; i < (configTestMode === "time" ? 100 : configWordSize); i+=1){
            generatedWords += words.words[Math.floor(Math.random()*words.length)] + " ";
        }
        mainText = [];
        let letterIdCounter = 0;
        for(const word of generatedWords.split(" ")){
            let letterElements = [];
            for(let i = 0; i < word.length; i++){
                const letterElement = {
                    id: letterIdCounter,
                    value: word.charAt(i),
                    typed: false,
                    removable: false,
                    active: false,
                }
                letterElements.push(letterElement);
                letterIdCounter += 1;
            }
            mainText.push(letterElements);
        }
    }

    function handleTiping(keydown :any){
        const pressedKey = keydown.data;
        if(!startedTyping){
            startedTyping = true;
            msTime = 0;
            timeInterval = setInterval(handleTime, 10);

            initialiseRecording(generatedWords);
        }

        if(keydown.inputType === "deleteContentBackward" && globalLetterIndex > backspaceMinPosition){
            saveKeyStore("backspace");
            backspace();
            // why am I doing this? because it does't work otherwise
            setTimeout(() => {
                handleCursor();
            }, 1)
        }

        else if(pressedKey){
            const expectedKey = generatedWords.charAt(globalLetterIndex);

            if(pressedKey === expectedKey && !hasMistaken){
                if(pressedKey === " " && hasMistaken === false){
                    backspaceMinPosition = globalLetterIndex;
                    currentWordIndex += 1;
                    currentLetterIndex = 0;
                }
                else{
                    setLetterProperty(currentWordIndex, currentLetterIndex, "typed", true);
                    currentLetterIndex += 1;
                }
                globalLetterIndex += 1;
                correctCharCount += 1;
                handleCursor();
            }
            else{
                hasMistaken = true;
                // const newValue = pressedKey !== " " ? pressedKey : 
                const newLetterElement = {
                    // id: letterIdCounter,
                    value: pressedKey,
                    typed: true,
                    removable: true,
                }
                mainText[currentWordIndex].splice(currentLetterIndex,0,newLetterElement);
                mainText[currentWordIndex] = mainText[currentWordIndex];
                currentLetterIndex +=1;
                globalLetterIndex +=1;

                // why am I doing this? because it does't work otherwise
                setTimeout(() => {
                    handleCursor();
                }, 1)
            }
            pressedKey === " " ? saveKeyStore("space") : saveKeyStore(pressedKey);
        }
        checkIfEnd();
    }

    function handleCursor(){
        if(!cursorElement){
            return
        }
        cancelTransitionCursor = true;
        const cursorPositionX = cursorElement.getBoundingClientRect().left;
        const cursorPositionY = cursorElement.getBoundingClientRect().top;

        let newCursorPositionX = 0;
        let newCursorPositionY = 0;

        if(currentLetterIndex === 0){
            newCursorPositionX = wordElements[currentWordIndex].childNodes[currentLetterIndex].getBoundingClientRect().left;
            newCursorPositionY = wordElements[currentWordIndex].childNodes[currentLetterIndex].getBoundingClientRect().top;
        }
        else{
            newCursorPositionX = wordElements[currentWordIndex].childNodes[currentLetterIndex-1].getBoundingClientRect().right;
            newCursorPositionY = wordElements[currentWordIndex].childNodes[currentLetterIndex-1].getBoundingClientRect().top;
        }
    
        const xOffset = newCursorPositionX - cursorPositionX
        const yOffset = newCursorPositionY - cursorPositionY;

        cancelTransitionCursor = false;
        cursorElementPosition.x += xOffset;
        cursorElementPosition.y += yOffset;    
        
        checkIfMoveText();
    }

    function resetCursor(){
        if(!cursorElement){
            return
        }
        cursorElementPosition = {x: 0, y: 0};
    }

    function backspace(){
        // if at the beginning of the text or if at the beginning of the word
        if(globalLetterIndex === 0 || currentLetterIndex === 0){
            return
        }

        const previousLetter = mainText[currentWordIndex][currentLetterIndex-1];

        // if previous letter can be removed then remove it
        if(previousLetter && previousLetter.removable === true){
            
            mainText[currentWordIndex].splice(currentLetterIndex-1, 1);
            mainText[currentWordIndex] = mainText[currentWordIndex];

            const previousPreviousLetter = mainText[currentWordIndex][currentLetterIndex-2];
            // it the letter before is previous letter is not wrong (removable) then the user has not mistaken
            // anymore and the next letter he will type will be a right one
            if(previousPreviousLetter && previousPreviousLetter.removable === false || currentLetterIndex === 1){
                hasMistaken = false;
            }
        }
        // it not then just change the color of it
        else{
            setLetterProperty(currentWordIndex, currentLetterIndex-1, "typed", false);
            correctCharCount -= 1;
        }
        globalLetterIndex -= 1;
        currentLetterIndex -= 1;
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
        pressedKeyStore.set({value: "", timestamp: 0});
        startedTyping = false;
        correctCharCount = 0;
        backspaceMinPosition = -1;
        hasMistaken = false;
        mainTextTranslateDistance = 0;
        globalLetterIndex = 0;
        currentWordIndex = 0;
        currentLetterIndex = 0;
    }

    function saveKeyStore(key:string){
        pressedKeyStore.set({value: key,timestamp: msTime});
        recordKeystroke(key, hasMistaken, generatedWords.charAt(globalLetterIndex-1), globalLetterIndex-1);
    }

    function checkIfMoveText(){
        if(currentLetterIndex === 0 && cursorElementPosition.y > 1 && hasMistaken === false){ // 10 is arbitrary
            mainTextTranslateDistance = -cursorElementPosition.y;
        }
    }
    
    function checkIfEnd(){
        if(configTestMode === "words"){
            if(globalLetterIndex === generatedWords.length-1 && !hasMistaken){
                const typingTestWpm = calculateWPM();
                dispatch("typingEnded", typingTestWpm);
                resetTyping();
            }
        }     
    }

    onMount(()=>{
        inputReference.focus();
        typingTestModeStore.subscribe(value => {configTestMode=value; resetTyping()});
        wordSizeStore.subscribe(value => {configWordSize=value; resetTyping()});
        typingTestTimeStore.subscribe(value => { configTestTime=value; resetTyping()});

        // this is needed if the user resized the screen
        resizeObserver = new ResizeObserver(() => {
            handleCursor();
            mainTextTranslateDistance = -cursorElementPosition.y;
        });
        resizeObserver.observe(mainTextElement);

        resetTyping();
    })    
</script>

<button hidden id="show-debugging" on:click={() => {showDebugging? showDebugging = false : showDebugging = true}}>debug</button>
{#if showDebugging}
    <div id="debugging">
        <div>Global letter index: {globalLetterIndex}</div>
        <div>Current word index: {currentWordIndex}</div>
        <div>Current letter index: {currentLetterIndex}</div>
        <div>Backspace min position: {backspaceMinPosition}</div>
        <div>Expected letter: {generatedWords[globalLetterIndex]}</div>
        <div>Current mode: {configTestMode}</div>
        <div>Word Size: {configWordSize}</div>
        <div>Time amount: {configTestTime}</div>
        <div>Correct chars typed: {correctCharCount}</div>
        <div>Mistake made: {hasMistaken}</div>
        <br>
        <div>Cursor Position x:{cursorElementPosition.x} y:{cursorElementPosition.y}</div>
    </div>
{/if}


<div id="statusBar">
    {#if startedTyping}
    <div id="typingProgress">  
        <TypingProgress wordsTyped={currentWordIndex} timeTyped={secondsTime}/>
    </div>
    {/if}
    <div id="configs"> 
        <Configs/>
    </div>
</div>


<div role="button" id="typingTest" on:keydown={()=>{}} on:click={inputReference.focus()} tabindex="0">
    <div id="overflow-placeholder">
        <div id="main-text" style="transform: translateY({mainTextTranslateDistance}px)" bind:this={mainTextElement}>
            <div id="cursor" style={`transform: translate(${cursorElementPosition.x}px, ${cursorElementPosition.y}px)`} bind:this={cursorElement}></div>
            {#each mainText as word, index}
                <div class="word" bind:this={wordElements[index]}>
                    {#each word as {id, value, typed, removable, active}}
                        <span class="letter 
                        {typed === true ? "typed" : ""}
                        {removable === true ? "removable" : ""}
                        {active === true ? "active" : ""}">
                        {value}</span>{/each}</div>
            {/each}
        </div>
    </div>
    <input 
        bind:this={inputReference} 
        id="wordsInput" 
        on:input={handleTiping}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
    >    
</div>

<style>
    #show-debugging{
        color:#506a7b;
        position: absolute;
        width: fit-content;
        height: min-content;
        right: 0%;
        top: 0%; 
    }
    #debugging{
        color:#506a7b;
        position: absolute;
        width: fit-content;
        height: min-content;
        left: 0%;
        top: 0%;
    }
    .word{
        margin: none;
        padding: none;
        width: fit-content;
    }

    #typingTest{
        width: 100%;
        display: flex;
        justify-content: center;
        height: calc(6rem + 13*3px); 
        /* for some obscure reason the gap betwen vertical divs is 13px but the gap is set to be 12px... */
    }
    #overflow-placeholder{
        width: 70%;
        height: 100%;
        overflow: hidden;
    }
    #main-text{    
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        color: rgb(127, 106, 106);
        width: 100%;
        font-size: 2rem;
        user-select: none;
        white-space: pre-wrap;
        transition: transform 0.25s ease-in-out;
    }
    #cursor{
        position: absolute;
        height: 2rem;
        width: 2px;
        background-color: #a8b9e4;
        /* transition: transform 0.1s ease-in-out; */
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

    .typed{
        color: white;
    }
    .removable{
        color: red;
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