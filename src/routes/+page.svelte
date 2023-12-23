<script lang="ts">
    import "./global.css"
    import TypingTest from "./typingTest.svelte";
    import TypingResult from "./typingResult.svelte";
    import Configs from "./configs.svelte";
    import { mode } from './stores.js';
    import { onMount } from 'svelte';

    let typingTestWpm :number;
    let resetTyping :any;
    let currentMode :string;

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
    }
    
    onMount(() => {
        const unsubscribe = mode.subscribe(value => {
            currentMode = value;
        });
        document.addEventListener('keydown', handleTabKeyDown);
        return unsubscribe;
    });
</script>

<Configs/>
{#if currentMode === 'typingTest'}
    <TypingTest bind:resetTypingProp={resetTyping} on:typingEnded={getTypingTestWpm}/>   
{:else if currentMode === 'typingResult'}
    <TypingResult typingTestWpm={typingTestWpm} />
{/if}
