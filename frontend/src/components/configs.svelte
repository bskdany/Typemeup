<script lang="ts">
    import { wordSizeStore, typingTestModeStore, typingTestTimeStore } from "../scripts/stores";
    import { onMount } from "svelte";

    let configWordSize :number;
    let typingTestMode :string;
    let typingTestTime :number;
    const typingModes = ["time", "words"];
    const modeWordAmount = [10, 25, 50, 100];
    const timeAmount = [15,30,60, 120];

    function setWordSize(value:number){
        configWordSize = value;
        wordSizeStore.set(value);
    }

    function setTypingTestTime(value: number){
        typingTestTime = value;
        typingTestTimeStore.set(value);
    }

    function setTypingTestMode(value: string){
        typingTestMode = value;
        typingTestModeStore.set(value);
    }

    onMount( () => {
        typingTestModeStore.subscribe( value => {typingTestMode = value;});
        wordSizeStore.subscribe( value => {configWordSize = value});
        typingTestTimeStore.subscribe( value => {typingTestTime = value});
        
        // default mode is time 15 seconds
        if(typingTestMode === ""){
            setTypingTestMode("words");
        }
        if(typingTestTime === 0){
            setTypingTestTime(15);
        }
        if(configWordSize === 0){
            setWordSize(10);
        }
    })
</script>

<div id="configWrapper">
    {#each typingModes as mode}
        <button 
            class={ mode === typingTestMode ? "selected" : "" } 
            id={mode + "selector"}; 
            on:click={() => setTypingTestMode(mode)}>
            {mode}
        </button>
    {/each}
    
    <div id="separator"></div>

    {#if typingTestMode==="words"}
        {#each modeWordAmount as wordAmount}
            <button class={configWordSize === wordAmount ? "selected" : "" } on:click={() => setWordSize(wordAmount)}>
                {wordAmount}
            </button>
        {/each}
    {:else if typingTestMode==="time"}
        {#each timeAmount as time}
            <button class={typingTestTime === time ? "selected" : "" } on:click={() => setTypingTestTime(time)}>
                {time}
            </button>
        {/each}
    {/if}
</div>


<style>
    button{
        color: rgb(127, 106, 106);
        font-size: 1rem;
        border: none;
        background-color: transparent;
    } 
    
    #configWrapper{
        display: flex;
        flex-direction: row;
        padding: 10px;
        margin-bottom: 50px;
        border: solid;
        color: transparent;
        border-radius: 10px;
        background-color: #2c2e31;
        width: min-content;
    }
    #separator{
        width: 2px;
        background-color:rgb(127, 106, 106);

    }
    .selected{
        color: #a8b9e4;
    }
</style>