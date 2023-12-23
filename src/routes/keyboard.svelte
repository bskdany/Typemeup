<script lang="ts">
    import { onMount } from "svelte";
    import {pressedKeyStore} from "./stores"

    let pressedKey :string;
    const row0 = ["`","1","2","3","4","5","6","7","8","9","0","-","=","Backspace"];
    const row1 = ["Tab","Q","W","E","R","T","Y","U","I","O","P","[","]","\\"];
    const row2 = ["Caps","A","S","D","F","G","H","J","K","L",";","'","Enter"];
    const row3 = ["Shift","Z","X","C","V","B","N","M",",",".","/","Shift"];
    const row4 = ["Space"];

    onMount(()=>{
        pressedKeyStore.subscribe(value => {pressedKey=value});
    })
</script>

<div id="keyboardWrapper">
    <div id="row0" class="row">
        {#each row0 as key}
            <div class="key" id=${key}>{key}</div>
        {/each}
    </div>
    <div id="row1" class="row">
        {#each row1 as key}
            <div class=" key {pressedKey==key.toLowerCase() ? "active" : ""}" id=${key}>{key}</div>
        {/each}
    </div>
    <div id="row2" class="row">
        {#each row2 as key}
            <div class=" key {pressedKey==key.toLowerCase() ? "active" : ""}" id=${key}>{key}</div>
        {/each}
    </div>
    <div id="row3" class="row">
        {#each row3 as key}
            <div class=" key {pressedKey==key.toLowerCase() ? "active" : ""}" id=${key}>{key}</div>
        {/each}
    </div>
    <div id="row4" class="row">
        {#each row4 as key}
            <div class=" key {pressedKey==key.toLowerCase() ? "active" : ""}" id={key}>{key}</div>
        {/each}
    </div>
</div>


<style>
    #keyboardWrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .row{
        display: grid;
    }
    #row0{
        grid-template-columns: auto repeat(12, 1fr) 2fr ;
    }
    #row1{
        grid-template-columns: 1.5fr repeat(12, 1fr) 1.5fr ;
    }
    #row2{
        grid-template-columns: 2fr repeat(11, 1fr) 2fr
    }
    #row3{
        grid-template-columns: 2.5fr repeat(10, 1fr) 2.5fr;
    }
    #row4{
        display: flex;
    }
    #Space{
        width: 250px;
    }
    
    .key{
        color: rgb(127, 106, 106);
        width: auto;
        min-width: 40px;
        height: 40px;
        background-color: transparent;
        border: solid;
        border-width: 2px;
        border-radius: 5px;
        border-color: #2c2e31;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .active{
        background-color: #27282a;  
    }
</style>