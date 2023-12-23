<script lang="ts">
    import { wordSize } from "./stores";
    import { onMount } from "svelte";

    let configWordSize :number;

    function setWordSize(value:number){
        wordSize.set(value);
    }

    onMount( () => {
        wordSize.set(15);
        wordSize.subscribe( value => {configWordSize = value});
        configWordSize = 10;
    })
</script>

<div id="configWrapper">
    <button id="wordSizeSelector">
        words
    </button> 
    <div id="separator"></div>
    <button class={configWordSize === 10 ? "selected" : "" } on:click={() => setWordSize(10)}>
        10
    </button>
    <button class={configWordSize === 25 ? "selected" : "" } on:click={() => setWordSize(25)}>
        25
    </button>
    <button class={configWordSize === 50 ? "selected" : "" } on:click={() => setWordSize(50)}>
        50
    </button>
    <button class={configWordSize === 100 ? "selected" : "" } on:click={() => setWordSize(100)}>
        100
    </button>

    <!-- <button on:click={() => configWordSize=50}>
        custom
    </button> -->
</div>


<style>
    button{
        color: rgb(127, 106, 106);
        font-size: 1rem;
        border: none;
        background-color: transparent;
    } 
    button:hover{
        color: #a8b9e4;
    }
    #configWrapper{
        display: flex;
        flex-direction: row;
        padding: 10px;
        border: solid;
        color: transparent;
        border-radius: 10px;
        background-color: #2c2e31;
        margin-bottom: 100px;
    }
    #separator{
        width: 2px;
        background-color:rgb(127, 106, 106);

    }
    .selected{
        color: #a8b9e4;
    }
</style>