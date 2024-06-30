import type { Letter, TextObject } from "../../interfaces";

export class TextObjectHandler {

  textObject: TextObject[] = $state([]);

  wordIndex: number = 0;
  letterIndex: number = 0;
  globalLetterIndex: number = 0;

  hasMistaken: boolean;
  wrongInputBuffer: string[];

  correctCharCount: number;

  targetText: string[];
  userTypedText: string[];

  // 0 -> need to remove all wrong letters before adding correct ones
  // 1 -> wrong letters are ignored
  // 2 -> spacebar skips the error and goes to the next word
  // 3 -> automatic error detection mode
  errorHandlingMode: number;

  constructor(targetText: string[], errorHandlingMode: number) {
    // this.wordIndex = $state(0);
    // this.letterIndex = $state(0);
    // this.globalLetterIndex = $state(0);
    this.hasMistaken = false;
    this.wrongInputBuffer = [];
    this.correctCharCount = 0;

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
              isTyped: false
            };
          }),
          id: textObject.length,
          isCompleted: false,
          length: word.length,
        }
      );
    });

    // adding a space after each word
    textObject.forEach(word => {
      word.letters.push({ text: " ", isSpace: true, isCorrect: false, isTyped: false });
      word.length += 1;
    })

    return textObject;
  }

  addKeyPressed(keyPressed: string) {
    this.userTypedText.push(keyPressed);

    switch (this.errorHandlingMode) {
      case 0:
        throw `Error correction mode ${this.errorHandlingMode} not implemented`;
        break;
      case 1:
        this.handleKeyPressMode1(keyPressed);
        break;
      case 2:
        throw `Error correction mode ${this.errorHandlingMode} not implemented`;
        break;
      case 3:
        this.handleKeyPressMode3(keyPressed);
        this.gotoNextLetter();
        break;
      default:
        throw "Wrong mode, 0 to 3 please";
    }
  }

  handleKeyPressMode1(keyPressed: string) {
    if (this.getLetter(0)?.text === keyPressed) {
      this.setLetterStatus(0, true, true);
      this.gotoNextLetter();
    }
  }

  handleKeyPressMode3(keyPressed: string) {
    if (!this.hasMistaken) {
      if (this.getLetter(0)?.text === keyPressed) {
        this.setLetterStatus(0, true, true);
      } else {
        this.wrongInputBuffer.push(keyPressed);
        this.setLetterStatus(0, true, false);
        this.hasMistaken = true;
      }
    }
    else {
      // handling mistake detection and correction logic

      // 1. Extra letter
      if (keyPressed == this.getLetter(-1)?.text) {
        if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
          this.setLetterStatus(0, true, false);
          // console.log("Swapped order of last two keys");
        }
        else {
          this.setLetterStatus(-1, true, false);
          // this.setLetterStatus(0, true, true);
          // console.log("Extra key pressed. Pressed " + this.wrongInputBuffer[0] + " instead of " + this.getLetter(-1).text);
          this.gotoPreviousLetter();
        }
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
      }
      // previous letter was miss-clicked
      else if (keyPressed == this.getLetter(0)?.text) {
        this.setLetterStatus(0, true, true);
        // console.log("Miss click. Pressed " + this.wrongInputBuffer[0] + " instead of " + this.getLetter(-1).text);
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
      }
      // 3. Missed a letter
      else if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
        this.setLetterStatus(-1, true, false);
        this.setLetterStatus(0, true, true);
        this.setLetterStatus(1, true, true);
        this.gotoNextLetter();

        // console.log("Missed a key");
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
      }
      else {
        // TODO: I can make a better detection method for a wider range of words
        // when this burts happens,
        this.setLetterStatus(0, true, false);
        // console.error("Text burst");
        // console.log(this.wrongInputBuffer);
      }
    }
  }

  setLetterStatus(offset: number, isTyped: boolean, isCorrect: boolean): boolean {
    const letter = this.getLetter(offset);
    if (letter != undefined) {
      letter.isTyped = isTyped;
      letter.isCorrect = isCorrect;
      return true;
    }
    else {
      return false;
    }
  }

  gotoNextLetter(): boolean {
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
    return !this.getLetter(1);
  }

}