<script lang="ts">
    import "./global.css"
    import TypingTest from "./typingTest.svelte";
    import TypingResult from "./typingResult.svelte";
    import Keyboard from "./keyboard.svelte";
    import { mode } from './stores.js';
    import { onMount } from 'svelte';

    export const prerender = true;

    let typingTestWpm :number;
    let resetTyping :any;
    let currentMode :string;
    let typingTestInput :any;

    function getTypingTestWpm(newValue:any){
        typingTestWpm = newValue.detail;
        mode.set(currentMode="typingResult");
    }

    function handleTabKeyDown(event :any) {
        if (event.key === 'Tab') {
            event.preventDefault();
            if(currentMode==="typingTest"){
                resetTyping()
            }
            else{
                mode.set(currentMode = 'typingTest');
            } 
        }
        if(typingTestInput){
            if(typingTestInput != document.activeElement){
                typingTestInput.focus();
            }
        }
    }
    
    onMount(() => {
        const unsubscribe = mode.subscribe(value => {
            currentMode = value;
        });
        document.addEventListener('keydown', handleTabKeyDown);
        return unsubscribe;
    });
</script>

{#if currentMode === 'typingTest'}
    <TypingTest bind:resetTypingProp={resetTyping} bind:inputReference={typingTestInput} on:typingEnded={getTypingTestWpm}/>   
    <div id="keyboardWrapper"><Keyboard/></div>
{:else if currentMode === 'typingResult'}
    <TypingResult typingTestWpm={typingTestWpm} />
{/if}

<style>
    @media only screen and (max-width: 767px) {
        #keyboardWrapper{
            display: none;
        }
    }
</style>