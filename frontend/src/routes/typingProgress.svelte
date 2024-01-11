<script lang="ts">
    import { onMount } from "svelte";
    import {typingTestModeStore, wordSizeStore, typingTestTimeStore} from "./stores"
    
    let typingTestMode :string;
    let typingTestTime :number;
    let wordSize :number;

    export let timeTyped :number;
    export let wordsTyped :number;

    onMount(()=> {
        typingTestModeStore.subscribe(value => {typingTestMode=value})
        wordSizeStore.subscribe(value => {wordSize=value})
        typingTestTimeStore.subscribe(value => {typingTestTime=value})
    })
</script>

{#if typingTestMode === "time"}
    <div>{typingTestTime-timeTyped}</div>
{:else if typingTestMode === "words"}
    <div>{wordsTyped}|{wordSize}</div>
{/if}

<style>
    div{
        color: #a8b9e4;
        font-size: 1.5rem;
    }
</style>