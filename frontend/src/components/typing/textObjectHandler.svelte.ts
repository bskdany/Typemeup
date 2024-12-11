import { ErrorCorrectionMode } from "@shared/types";
import type { Letter, TextObject } from "../../types/interfaces";

export class TextObjectHandler {

  textObject: TextObject[] = $state([]);

  wordIndex: number = 0;
  letterIndex: number = 0;
  globalLetterIndex: number = 0;
  correctKeyPresses: number = 0;
  totalKeyPresses: number = 0;

  hasMistaken: boolean;
  wrongInputBuffer: string[];

  targetText: string[];
  userTypedText: string[];
  keyPressTimings: number[];
  keyPressCorrectness: boolean[];


  // 0 -> automatic error detection mode
  // 1 -> need to remove all wrong letters before adding correct ones
  // 2 -> error is ignored

  errorHandlingMode: ErrorCorrectionMode;

  constructor(targetText: string[], errorHandlingMode: number, useEntireWords = true) {
    this.hasMistaken = false;
    this.wrongInputBuffer = [];
    this.correctKeyPresses = 0;
    this.totalKeyPresses = 0;

    this.targetText = targetText;
    this.keyPressTimings = [];
    this.userTypedText = [];
    this.keyPressCorrectness = [];

    this.errorHandlingMode = errorHandlingMode;

    if (useEntireWords) {
      this.textObject = this.generateTextObject(this.targetText);
    }
    else {
      this.textObject = this.generateTextObjectByLetter(this.targetText);
    }
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
              id: 0,
            }
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

  generateTextObjectByLetter(targetText: string[]) {
    let textObject: TextObject[] = [];
    let wordLetters: TextObject["letters"] = [];

    targetText.forEach((letter: string, index) => {
      if (letter !== " ") {
        wordLetters.push(
          {
            text: letter,
            isSpace: false,
            isCorrect: false,
            isTyped: false,
            errorStatus: "",
            id: 0,
          }
        )
      }

      if (letter === " " || index === targetText.length - 1) {
        textObject.push(
          {
            letters: [...wordLetters],
            id: textObject.length,
            isCompleted: false,
            length: wordLetters.length,
          }
        );

        wordLetters = [];
      }
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

  logKeyPress(isCorrect: boolean) {
    this.totalKeyPresses += 1;
    this.keyPressCorrectness.push(isCorrect);

    if (isCorrect) {
      this.correctKeyPresses += 1;
    }
  }

  addKeyPressed(keyPressed: string) {
    this.userTypedText.push(keyPressed);
    this.keyPressTimings.push(Date.now());

    switch (this.errorHandlingMode) {
      case ErrorCorrectionMode.smart:
        this.handleKeyPressMode0(keyPressed);
        break;
      case ErrorCorrectionMode.errorBlock:
        this.handleKeyPressMode1(keyPressed);
        break;
      case ErrorCorrectionMode.errorIgnore:
        this.handleKeyPressMode2(keyPressed);
        break;
      case ErrorCorrectionMode.replayReserved:
        this.handleKeyPressMode3(keyPressed);
        break;
      default:
        throw "Wrong mode, 0 to please";
    }

  }

  handleKeyPressMode0(keyPressed: string) {
    if (keyPressed === "backspace") {
      if (this.getLetter(-1)?.errorStatus === "extra") {
        this.setLetterStatus(-1, { errorStatus: "wrong" })
      }
      else if (this.getLetter(-2)?.errorStatus === "missed") {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true, errorStatus: "" });
        this.gotoPreviousLetter();

        this.setLetterStatus(-1, { isTyped: false, isCorrect: true, errorStatus: "" });
        this.gotoPreviousLetter();

        this.logKeyPress(false);
      }
      else {
        this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
        this.gotoPreviousLetter();
        this.logKeyPress(false);
      }
    }
    else if (keyPressed === "backspaceWord") {

      this.logKeyPress(false);
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
        this.logKeyPress(true);
      } else {
        this.wrongInputBuffer.push(keyPressed);
        this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
        this.hasMistaken = true;
        this.logKeyPress(false);
      }
      this.gotoNextLetter();
    }
    else {
      // Handling mistake detection and correction logic
      // There are 4 possible scenarios, extra letter, miss-click, missed letter and burst

      // 1. Extra letter
      if (keyPressed == this.getLetter(-1)?.text) {

        // check if the user swapped the order of two letters
        // target text      a b c d e f
        //                       X 
        // typed text       a b d c e f
        if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
          this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "swapped" });
          this.setLetterStatus(-1, { errorStatus: "swapped" });
          this.gotoNextLetter();
          this.logKeyPress(false);
        }
        // target text    a b c d d e
        //                | |  \
        // typed text     a b x c d e
        else {
          // in this situation the user made 1 mistake only, which is pressing x when it should've pressed c
          // because of this there is no point of counting the next error, when the user pressed c instead of d
          this.logKeyPress(true);
          this.setLetterStatus(-1, { isTyped: true, isCorrect: false, errorStatus: "extra" });
        }

        this.hasMistaken = false
        this.wrongInputBuffer = [];
      }
      // 2. Miss-click
      // target text        a b c d e f
      //                          |
      // typed text         a b c g e f
      else if (keyPressed == this.getLetter(0)?.text) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
        this.setLetterStatus(-1, { errorStatus: "wrong" })
        this.hasMistaken = false;
        this.wrongInputBuffer = [];
        this.gotoNextLetter();
        this.logKeyPress(true);
      }
      // 3. Missed letter 
      // target text      a b c d e f
      //                         / 
      // typed text       a b c e e f
      else if (this.wrongInputBuffer[0] == this.getLetter(0)?.text) {
        this.setLetterStatus(-1, { isTyped: true, isCorrect: false, errorStatus: "missed" });
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
        this.setLetterStatus(1, { isTyped: true, isCorrect: true });
        this.gotoNextLetter();
        this.gotoNextLetter();

        this.logKeyPress(true);

        this.hasMistaken = false;
        this.wrongInputBuffer = [];
      }
      else {
        // TODO: I can make a better detection method for a wider range of words
        // when this burts happens,
        this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
        this.gotoNextLetter();
        this.logKeyPress(false);
      }
    }
  }

  handleKeyPressMode1(keyPressed: string) {
    if (keyPressed === "backspace") {
      this.logKeyPress(false);

      if (this.getLetter(-1)?.isCorrect === false) {
        this.hasMistaken = false
      }
      this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
      this.gotoPreviousLetter();
    }
    else if (keyPressed === "backspaceWord") {
      this.logKeyPress(false);

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
        this.logKeyPress(false);
      }
      else if (keyPressed === this.getLetter(0)?.text) {
        this.setLetterStatus(0, { isTyped: true, isCorrect: true });
        this.logKeyPress(true);
      }
      else {
        this.setLetterStatus(0, { isTyped: true, isCorrect: false });
        this.logKeyPress(false);
        this.hasMistaken = true;
      }
      this.gotoNextLetter();
    }
  }

  handleKeyPressMode2(keyPressed: string) {
    if (this.getLetter(0)?.text === keyPressed) {
      this.logKeyPress(true);
      this.setLetterStatus(0, { isTyped: true, isCorrect: true });
      this.gotoNextLetter();
    }
    else if (keyPressed === "backspace") {
      this.logKeyPress(false);
      this.setLetterStatus(-1, { isTyped: false, isCorrect: true });
      this.gotoPreviousLetter();
    }
    else if (keyPressed === "backspaceWord") {
      this.logKeyPress(false);

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
      this.logKeyPress(false);
      this.setLetterStatus(0, { isTyped: true, isCorrect: false, errorStatus: "wrong" });
      setTimeout(() => {
        this.setLetterStatus(0, { isTyped: false, isCorrect: false, errorStatus: "" });
      }, 100);
    }
  }

  handleKeyPressMode3(keyPressed: string) {
    if (this.hasMistaken) {
      this.setLetterStatus(0, { isTyped: true, isCorrect: false });
      this.logKeyPress(false);
    }
    else if (keyPressed === this.getLetter(0)?.text) {
      this.setLetterStatus(0, { isTyped: true, isCorrect: true });
      this.logKeyPress(true);
    }
    else {
      this.setLetterStatus(0, { isTyped: true, isCorrect: false });
      this.logKeyPress(false);
      this.hasMistaken = true;
    }
    this.gotoNextLetter();
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
