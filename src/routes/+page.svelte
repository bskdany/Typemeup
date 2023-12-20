<script lang="ts">
    import words from "../words/words.json";
    const wordsSize = 10;
    let wordList = "";
    let offset = 2;
    let currentPosition = 0 + offset;

    for(let i = 0; i<wordsSize; i+=1){
        wordList +=(words.words[Math.floor(Math.random()*words.length)]) + " ";
    }
    let hasMistaken = false;

    function handleCursor(letter, movingDirection){
        const cursor = document.getElementById("cursor");
        const letterWidth = letter.offsetWidth;
        console.log(letterWidth)
        const currentMargin = parseInt(window.getComputedStyle(cursor).getPropertyValue('margin-left').slice(0,-2)) + 2;
        console.log(currentMargin + letterWidth*movingDirection + "px")
        cursor.style.marginLeft = currentMargin + letterWidth*movingDirection + "px";
    }

    function handleTiping(keydown:any){
        const pressedKey = keydown.data;
        if(keydown.inputType=="deleteContentBackward"){
            currentPosition -=1;
            const letter = document.getElementById("main-text")?.childNodes[currentPosition]
            if(letter){
                if(letter.classList.contains("removable")){
                    letter.remove();
                    const previousLetter = document.getElementById("main-text")?.childNodes[currentPosition-1]
                    if(currentPosition==1 || previousLetter?.style?.color == "white"){
                        hasMistaken=false;
                    }
                }
                else{
                    letter.style.color= "rgb(127, 106, 106)";
                }
            }
        }
        else{
            let letter = document.getElementById("main-text").childNodes[currentPosition]
            handleCursor(letter, 1)
            if(letter){
                if(pressedKey == wordList[currentPosition-offset] && !hasMistaken){
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
                alert("End")
            }
        }
    }
</script>


<div id="main-text">
    <span id="cursor"></span>
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
        font-size: 2rem;
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
    #cursor{
        position:absolute;
        width: 2px;
        height: 2rem;
        background-color: rgb(186, 175, 175);
    }
    .letter{
        margin-left: 2px;
    }

</style>



