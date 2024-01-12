<script lang="ts">
    import "./global.css"
    import { goto } from '$app/navigation';
    import TypingTest from "../components/typingTest.svelte";
    import TypingResult from "../components/typingResult.svelte";
    import Keyboard from "../components/keyboard.svelte";
    import { mode } from '../scripts/stores.js';
    import { onDestroy, onMount } from 'svelte';

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
    
    function navigateToProfile() {
        goto('/profile');
    }

    onMount(() => {
        const unsubscribe = mode.subscribe(value => {
            currentMode = value;
        });
        document.addEventListener('keydown', handleTabKeyDown);
        return () => {
            unsubscribe;
            document.removeEventListener('keydown', handleTabKeyDown)
        }
    });

</script>

<button id="profilePage" on:click={navigateToProfile}>
    Profile
</button>


{#if currentMode === 'typingTest'}
    <TypingTest bind:resetTypingProp={resetTyping} bind:inputReference={typingTestInput} on:typingEnded={getTypingTestWpm}/>   
    <div id="keyboardWrapper"><Keyboard/></div>
{:else if currentMode === 'typingResult'}
    <TypingResult typingTestWpm={typingTestWpm} on:restartTrigger={() => mode.set(currentMode = 'typingTest')}/>
{/if}

<style>
    #profilePage{
        position: absolute;
        right: 30px;
        top: 30px;
    }

    @media only screen and (max-width: 767px) {
        #keyboardWrapper{
            display: none;
        }
    }
</style>