<script lang="ts">
    import words from "../words/words.json";
    const wordsSize = 1;
    let wordList = "";
    let currentPosition = 0;
    for(let i = 0; i<wordsSize; i+=1){
        wordList +=(words.words[Math.floor(Math.random()*words.length)]) + " ";
    }
    let hasMistaken = false;

    function handleTiping(keydown:any){
        const pressedKey = keydown.data;

        if(keydown.inputType=="deleteContentBackward"){
            currentPosition -=1
            const letter = document.getElementById("main-text")?.childNodes[currentPosition]
            if(letter){
                if(letter.classList.contains("removable")){
                    letter.remove();
                    const previousLetter = document.getElementById("main-text")?.childNodes[currentPosition-1]
                    if(previousLetter.style.color == "white"){
                        hasMistaken=false;
                    }
                }
                else{
                    letter.style.color= "rgb(127, 106, 106)";
                }
            }
            return
        }
        const letter = document.getElementById("main-text")?.childNodes[currentPosition]
        if(letter){
            if(pressedKey == wordList[currentPosition] && !hasMistaken){
                letter.style.color= "white";
                
            }
            else{
                hasMistaken = true;
                let newLetter = letter.cloneNode()
                newLetter.textContent=pressedKey;
                newLetter.classList.add("removable");
                newLetter.style.color = "red";
                let parent = document.getElementById("main-text")
                parent.insertBefore(newLetter, letter)
            }
        }
        currentPosition+=1;
        if(currentPosition==wordList.length-1 && !hasMistaken){
            alert("AAAAAAAAAAAA")
        }

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
        font-size: 2em;
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



