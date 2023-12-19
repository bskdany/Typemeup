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

        if(keydown.inputType=="deleteContentBackward"){
            currentPosition -=1
            const letter = document.getElementById("main-text")?.childNodes[currentPosition]
            if(letter){
                if(letter.classList.contains("removable")){
                    letter.remove()
                }
                else{
                    letter.style.color= "rgb(127, 106, 106)";
                }
            }
            return
        }
        const letter = document.getElementById("main-text")?.childNodes[currentPosition]
        if(letter){
            if(pressedKey == wordList[currentPosition]){
                letter.style.color= "white";
            }
            else{
                let newLetter = letter.cloneNode()
                newLetter.textContent=pressedKey;
                newLetter.classList.add("removable");
                newLetter.style.color = "red";
                let parent = document.getElementById("main-text")
                parent.insertBefore(newLetter, letter)
            }
        }
        currentPosition+=1;

    }

</script>


<div id="main-text">
    {#each wordList as letter}
        <span class="letter">{letter}</span>
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
        user-select: none;
    }
    #wordsInput{
        width: 80%;
        height: 100px;
        position:absolute;
        background: transparent;
        border: none;
        opacity: none;
        outline: none;
        color: transparent;
        user-select: none;
        cursor: default;
    }
</style>



