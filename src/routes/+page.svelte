<script lang="ts">
    import words from "../words/words.json";
    const wordsSize = 60;
    let wordList = "";
    let currentPosition = 0;
    for(let i = 0; i<wordsSize; i+=1){
        wordList +=(words.words[Math.floor(Math.random()*words.length)]) + " ";
    }

    function handleTiping(keydown:any){
        const pressedKey = keydown.data;
        console.log(keydown)
        if(keydown.inputType=="deleteContentBackward"){
            currentPosition -=1
            const letter = document.getElementById("letterAtIndex"+currentPosition);
            if(letter){
                letter.style.color= "rgb(127, 106, 106)";
            }
            return
        }

        const letter = document.getElementById("letterAtIndex"+currentPosition);
        if(letter){
            if(pressedKey == wordList[currentPosition]){
                letter.style.color= "white";
            }
            else{
                letter.style.color= "red";
            }
        }
        currentPosition+=1;
    }

</script>


<div id="main-text" >
    {#each wordList as letter, index}
        <span class="letter" id="letterAtIndex{index}">{letter}</span>
    {/each}
</div>
<input id="wordsInput" on:input={handleTiping}>

<style>
    :global(body){
        background-color: #323437;
        font-family: Arial, Helvetica, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100lvh;
        flex-direction: column;
    }
    :global(footer){
        display: none;
    }
    #main-text{
        color: rgb(127, 106, 106);
        font-size: larger;
        width: 80%;
    }
    #wordsInput{
        width: 50%;
    }
</style>



