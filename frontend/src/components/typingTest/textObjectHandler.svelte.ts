import type { Letter, TextObject } from "../../types/interfaces";

export class TextObjectHandler {

  textObject: TextObject[] = $state([]);

  wordIndex: number = 0;
  letterIndex: number = 0;
  globalLetterIndex: number = 0;

  hasMistaken: boolean;
  wrongInputBuffer: string[];

  targetText: string[];
  userTypedText: string[];

  // 0 -> automatic error detection mode
  // 1 -> need to remove all wrong letters before adding correct ones
  // 2 -> error is ignored

  errorHandlingMode: number;

  constructor(targetText: string[], errorHandlingMode: number) {
    // this.wordIndex = $state(0);
    // this.letterIndex = $state(0);
    // this.globalLetterIndex = $state(0);
    this.hasMistaken = false;
    this.wrongInputBuffer = [];

    this.targetText = targetText;
    this.userTypedText = [];

    this.errorHandlingMode = errorHandlingMode;

    this.textObject = this.generateTextObject(this.targetText);
  }

  addText(targetText: string[]) {
    const newTextObjectData = this.generateTextObject(targetText);
    this.textObject = this.textObject.concat(newTextObjectData);
  }


  generateTextObject(targetText: string[]) {
    let textObject: TextObject[] = [];

    targetText.forEach((word: string) => {
      textObject.push(
        {
          letters: word.split("").map(letter => {
            return {
              text: letter,
              isSpace: false,
              isCorrect: false,
              isTyped: false,
              errorStatus: "",
              id: 0
            };
          }),
          id: textObject.length,
          isCompleted: false,
          length: word.length,
        }
      );
    });

    // adding a space after each word
    textObject.forEach((wordObject, index) => {
      if (index !== textObject.length - 1) {
        wordObject.letters.push({ text: " ", isSpace: true, isCorrect: false, isTyped: false, errorStatus: "", id: 0 });
        wordObject.length += 1;
      }
    })

    // going throug each object and adding the id
    let letterId = 0;
    textObject.forEach((wordObject, index) => {
      wordObject.letters.forEach(letterObject => {
        letterObject.id = letterId;
        letterId += 1;
      });
    })

    return textObject;
  }

  addKeyPressed(keyPressed: string) {
    this.userTypedText.push(keyPressed);

    switch (this.errorHandlingMode) {
      case 0:
        this.handleKeyPressMode0(keyPressed);
        break;
      case 1:
        this.handleKeyPressMode1(keyPressed);
        break;
      case 2:
        this.handleKeyPressMode2(keyPressed);
        break;
      default:
        throw "Wrong mode, 0 to please";
    }
  }

  handleKeyPressMode0(keyPressed: string) {
    if (keyPressed === "backspace") {
      this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
      this.gotoPreviousLetter();
    }
    else if (keyPressed === "backspaceWord") {
      if (this.getLetter(-1)?.text === " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }

      // backspace to the previous space
      while (this.getLetter(-1) && this.getLetter(-1)?.text !== " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }
    }

    else if (!this.hasMistaken) {
      if (this.getLetter(0)?.text === keyPressed) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
      } else {
        this.wrongInputBuffer.push(keyPressed);
        this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
        this.hasMistaken = true;
      }
      this.gotoNextLetter();
    }
    else {
      // handling mistake detection and correction logic

      // 1. Extra letter
      if (keyPressed == this.getLetter(-1)?.text) {
        if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
          this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "swapped" });
          this.setLetterStatus(-1, { errorStatus: "swapped" });
          // console.log("Swapped order of last two keys");
          this.gotoNextLetter();
        }
        else {
          this.setLetterStatus(-1, { isTyped: true, isCorrect: false, errorStatus: "extra" });
          // this.setLetterStatus(0, true, true);
          // console.log("Extra key pressed. Pressed " + this.wrongInputBuffer[0] + " instead of " + this.getLetter(-1).text);
          // this.gotoPreviousLetter();
        }
        this.hasMistaken = false
        this.wrongInputBuffer = [];
      }
      // previous letter was miss-clicked
      else if (keyPressed == this.getLetter(0)?.text) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
        this.setLetterStatus(-1, { errorStatus: "wrong" })
        // console.log("Miss click. Pressed " + this.wrongInputBuffer[0] + " instead of " + this.getLetter(-1).text);
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
        this.gotoNextLetter();
      }
      // 3. Missed a letter
      else if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
        this.setLetterStatus(-1, { isTyped: true, isCorrect: false, errorStatus: "missed" });
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
        this.setLetterStatus(1, { isTyped: true, isCorrect: true });
        this.gotoNextLetter();
        this.gotoNextLetter();

        // console.log("Missed a key");
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
      }
      else {
        // TODO: I can make a better detection method for a wider range of words
        // when this burts happens,
        this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
        // console.error("Text burst");
        // console.log(this.wrongInputBuffer);
        this.gotoNextLetter();
      }
    }
  }

  handleKeyPressMode1(keyPressed: string) {
    if (keyPressed === "backspace") {
      if (this.getLetter(-1)?.isCorrect === false) {
        this.hasMistaken = false
      }
      this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
      this.gotoPreviousLetter();
    }
    else if (keyPressed === "backspaceWord") {
      if (this.getLetter(-1)?.text === " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }

      // backspace to the previous space
      while (this.getLetter(-1) && this.getLetter(-1)?.text !== " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }
    }
    else {
      if (this.hasMistaken) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: false });
      }
      else if (keyPressed === this.getLetter(0)?.text) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
      }
      else {
        this.setLetterStatus(0, { isTyped: true, isCorrect: false });
        this.hasMistaken = true;
      }
      this.gotoNextLetter();
    }
  }

  handleKeyPressMode2(keyPressed: string) {
    if (this.getLetter(0)?.text === keyPressed) {
      this.setLetterStatus(0, { isTyped: true, isCorrect: true });
      this.gotoNextLetter();
    }
    else if (keyPressed === "backspace") {
      this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
      this.gotoPreviousLetter();
    }
    else if (keyPressed === "backspaceWord") {
      if (this.getLetter(-1)?.text === " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }

      // backspace to the previous space
      while (this.getLetter(-1) && this.getLetter(-1)?.text !== " ") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
      }
    }
    else {
      this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
      setTimeout(() => {
        this.setLetterStatus(0, { isTyped: false, isCorrect: false, errorStatus: "" });
      }, 100);
    }
  }

  setLetterStatus(offset: number, data: { isTyped?: boolean, isCorrect?: boolean, errorStatus?: "extra" | "missed" | "swapped" | "wrong" | "" }): boolean {
    const letter = this.getLetter(offset);
    if (letter) {
      letter.isTyped = data.isTyped ?? letter.isTyped;
      letter.isCorrect = data.isCorrect ?? letter.isCorrect;
      letter.errorStatus = data.isCorrect ? "" : letter.errorStatus;
      letter.errorStatus = data.errorStatus ?? letter.errorStatus;

      return true;
    }
    else {
      return false;
    }
  }

  gotoNextLetter(): boolean {
    // console.log("Went to next letter")
    const currentWordLength = this.textObject[this.wordIndex].length;

    if (this.letterIndex === currentWordLength - 1) {
      if (this.wordIndex === this.textObject.length - 1) {
        return false; // can't do
      }
      else {
        this.wordIndex += 1;
        this.letterIndex = 0;
      }
    }
    else {
      this.letterIndex += 1;
    }

    this.globalLetterIndex += 1;
    return true;
  }

  gotoPreviousLetter(): boolean {
    if (this.letterIndex === 0) {
      if (this.wordIndex === 0) {
        return false
      }
      else {
        this.wordIndex -= 1;
        this.letterIndex = this.textObject[this.wordIndex].length - 1;
      }
    }
    else {
      this.letterIndex -= 1;
    }

    this.globalLetterIndex -= 1;
    return true;
  }

  getLetter(offset: number): Letter | undefined {
    let offsettedWordIndex = this.wordIndex;
    let offsettedLetterIndex = this.letterIndex + offset;
    let currentWordLength = this.textObject[offsettedWordIndex].length;

    while (offsettedLetterIndex >= currentWordLength) {
      offsettedLetterIndex -= currentWordLength;
      offsettedWordIndex += 1;
      if (offsettedWordIndex >= this.textObject.length) {
        return undefined;
      }
    }

    while (offsettedLetterIndex < 0) {
      offsettedWordIndex -= 1;

      if (offsettedWordIndex < 0) {
        return undefined;
      }
      currentWordLength = this.textObject[offsettedWordIndex].length;
      offsettedLetterIndex += currentWordLength;
    }

    return this.textObject[offsettedWordIndex].letters[offsettedLetterIndex];
  }

  getWord(offset: number): TextObject | undefined {
    const offsettedWordIndex = this.wordIndex + offset;
    if (offsettedWordIndex < 0 || offsettedWordIndex >= this.textObject.length) {
      return undefined;
    }
    else {
      return this.textObject[offsettedWordIndex];
    }
  }

  isEnd() {
    return !this.getLetter(1) && this.getLetter(0)?.isTyped;
  }
}