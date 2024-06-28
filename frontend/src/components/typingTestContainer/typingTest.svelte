<script lang="ts">
	import {
		initialiseRecording,
		recordKeystroke,
		stopRecordKeystroke
	} from '../../scripts/analiseKeyPresses';
	import { onMount } from 'svelte';
	import {
		wordSizeStore,
		pressedKeyStore,
		typingTestModeStore,
		typingTestTimeStore
	} from '../../scripts/stores';
	import Configs from './configs.svelte';
	import TypingProgress from './typingProgress.svelte';
	import { TextObjectHandler } from './textObjectHandler.svelte';
	import type { TextObject } from '../../interfaces';

	const {
		targetText,
		errorCorrectionMode,
		testEnded
	}: {
		targetText: string[];
		errorCorrectionMode: number;
		testEnded: (data: { wpm: number }) => void;
	} = $props();

	let textObject: TextObjectHandler = $state(
		new TextObjectHandler(targetText, errorCorrectionMode)
	);

	let cursorElementPosition: { x: number; y: number } = $state({ x: 0, y: 0 });
	let mainTextTranslateDistance: number = $state(0);

	let startedTyping: boolean = false;

	// from stores3
	// let configWordSize: number;
	let configTestMode: string;
	let configTestTime: number;

	// for handling time
	let msTime: number = 0;
	let secondsTime: number = 0;
	let timeInterval: any; // to record the time

	// element binds
	// let mainText: object[][] = [];
	let mainTextElement: HTMLElement;
	let textObjectBind: HTMLElement[] = [];
	let cursorElement: HTMLElement;
	let typingTestInput: HTMLElement;

	// let generatedWords: string = "";
	// let globalLetterIndex: number = 0;
	// let currentWordIndex: number = 0;
	// let currentLetterIndex: number = 0;
	// let startedTyping: boolean = false;
	// let showDebugging: boolean = false;
	// let hasMistaken: boolean = false;
	// let cancelTransitionCursor: boolean = false;
	// let correctCharCount: number = 0;
	// let backspaceMinPosition: number = -1; // the minimin position in the letters array to which the user can backspace

	let resizeObserver; // to handle mainText resizing
	// const dispatch = createEventDispatcher();

	function handleTime() {
		msTime += 10;
		if (msTime % 1000 === 0) {
			secondsTime += 1;
		}
		if (configTestMode === 'time' && msTime > configTestTime * 1000) {
			// const typingTestWpm = calculateWPM();
			testEnded({ wpm: 10 });
			// resetTyping();
		}
	}

	// function calculateWPM() {
	// 	return parseFloat(((correctCharCount / 5) * (60 / (msTime / 1000))).toFixed(2));
	// }

	function processKeyPress(keydown: any) {
		const pressedKey = keydown.data;
		if (!startedTyping) {
			startedTyping = true;
			msTime = 0;
			timeInterval = setInterval(() => handleTime(), 10);
		}

		textObject.addKeyPressed(pressedKey);
		console.log(textObject);

		handleCursor();
		checkIfEnd();
	}

	function handleCursor() {
		if (!cursorElement) {
			return;
		}

		const cursorPositionX = cursorElement.getBoundingClientRect().left;
		const cursorPositionY = cursorElement.getBoundingClientRect().top;

		let newCursorPositionX = 0;
		let newCursorPositionY = 0;

		const childNode = textObjectBind[textObject.wordIndex].childNodes[textObject.letterIndex];

		if (childNode && childNode instanceof Element) {
			const rect = childNode.getBoundingClientRect();
			newCursorPositionX = rect.left;
			newCursorPositionY = rect.top;
		} else {
			// Handle the case where the childNode is not an Element
			throw 'Error moving cursor, child node is not an alement';
		}

		const xOffset = newCursorPositionX - cursorPositionX;
		const yOffset = newCursorPositionY - cursorPositionY;

		cursorElementPosition.x += xOffset;
		cursorElementPosition.y += yOffset;
	}

	function resetCursor() {
		if (!cursorElement) {
			return;
		}
		cursorElementPosition = { x: 0, y: 0 };
	}

	// function resetTyping() {
	//   // reset keystroke recording stuff
	//   stopRecordKeystroke();

	//   // reset stopwatch for wpm
	//   msTime = 0;
	//   secondsTime = 0;
	//   clearInterval(timeInterval);

	//   resetCursor();

	//   // resets the pressed key on keyboard to none
	//   pressedKeyStore.set({ value: "", timestamp: 0 });
	//   startedTyping = false;
	//   correctCharCount = 0;
	//   backspaceMinPosition = -1;
	//   hasMistaken = false;
	//   mainTextTranslateDistance = 0;
	//   globalLetterIndex = 0;
	//   currentWordIndex = 0;
	//   currentLetterIndex = 0;
	// }

	function checkIfMoveText() {
		if (
			textObject.letterIndex === 0 &&
			cursorElementPosition.y > 1 &&
			textObject.hasMistaken === false
		) {
			// 10 is arbitrary
			mainTextTranslateDistance = -cursorElementPosition.y;
		}
	}

	export function focus() {
		if (typingTestInput) {
			if (typingTestInput != document.activeElement) {
				typingTestInput.focus();
			}
		}
	}

	function checkIfEnd() {
		if (configTestMode === 'words') {
			if (textObject.isEnd()) {
				// const typingTestWpm = calculateWPM();
				testEnded({ wpm: 10 });
			}
		}
	}

	onMount(() => {
		typingTestInput.focus();
		typingTestModeStore.subscribe((value) => {
			configTestMode = value;
			// resetTyping();
		});
		// wordSizeStore.subscribe((value) => {
		// 	configWordSize = value;
		// 	// resetTyping();
		// });
		typingTestTimeStore.subscribe((value) => {
			configTestTime = value;
			// resetTyping();
		});

		// this is needed if the user resized the screen
		resizeObserver = new ResizeObserver(() => {
			// handleCursor();
			mainTextTranslateDistance = -cursorElementPosition.y;
		});
		resizeObserver.observe(mainTextElement);

		// resetTyping();
	});
</script>

<!-- <button
  hidden
  id="show-debugging"
  on:click={() => {
    showDebugging ? (showDebugging = false) : (showDebugging = true);
  }}>debug</button
> -->

<!-- {#if showDebugging}
  <div id="debugging">
    <div>Global letter index: {globalLetterIndex}</div>
    <div>Current word index: {currentWordIndex}</div>
    <div>Current letter index: {currentLetterIndex}</div>
    <div>Backspace min position: {backspaceMinPosition}</div>
    <div>Expected letter: {generatedWords[globalLetterIndex]}</div>
    <div>Current mode: {configTestMode}</div>
    <div>Word Size: {configWordSize}</div>
    <div>Time amount: {configTestTime}</div>
    <div>Correct chars typed: {correctCharCount}</div>
    <div>Mistake made: {hasMistaken}</div>
    <br />
    <div>
      Cursor Position x:{cursorElementPosition.x} y:{cursorElementPosition.y}
    </div>
  </div>
{/if} -->

<div id="statusBar">
	{#if startedTyping}
		<div id="typingProgress">
			<TypingProgress wordsTyped={textObject.wordIndex} timeTyped={secondsTime} />
		</div>
	{/if}
	<div id="configs">
		<Configs />
	</div>
</div>

<div
	role="button"
	id="typingTest"
	onkeydown={() => {}}
	onclick={() => typingTestInput.focus()}
	tabindex="0"
></div>

<div id="overflow-placeholder">
	<div
		id="main-text"
		style="transform: translateY({mainTextTranslateDistance}px)"
		bind:this={mainTextElement}
	>
		<div
			id="cursor"
			style={`transform: translate(${cursorElementPosition.x}px, ${cursorElementPosition.y}px)`}
			bind:this={cursorElement}
		></div>
		{#if textObject?.textObject?.length > 0}
			{#each textObject?.textObject as word, index}
				<div class="word" bind:this={textObjectBind[index]}>
					{#each word.letters as { text, isCorrect, isSpace, isTyped }}
						<span
							class="letter
                {isSpace ? 'space' : ''}
                {isTyped && isCorrect ? 'correct' : ''}
                {isTyped && !isCorrect ? 'incorrect' : ''}"
						>
							{text}
						</span>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>

<input
	bind:this={typingTestInput}
	id="wordsInput"
	oninput={processKeyPress}
	autocomplete="off"
	autocorrect="off"
	autocapitalize="off"
	spellcheck="false"
/>

<style>
	#show-debugging {
		color: #506a7b;
		position: absolute;
		width: fit-content;
		height: min-content;
		right: 0%;
		top: 0%;
	}
	#debugging {
		color: #506a7b;
		position: absolute;
		width: fit-content;
		height: min-content;
		left: 0%;
		top: 0%;
	}
	.word {
		margin: none;
		padding: none;
		width: fit-content;
	}

	#typingTest {
		width: 100%;
		display: flex;
		justify-content: center;
		height: calc(6rem + 13 * 3px);
		/* for some obscure reason the gap betwen vertical divs is 13px but the gap is set to be 12px... */
	}
	#overflow-placeholder {
		width: 70%;
		height: 100%;
		overflow: hidden;
	}
	#main-text {
		display: flex;
		flex-wrap: wrap;
		/* gap: 12px; */
		color: rgb(127, 106, 106);
		width: 100%;
		font-size: 2rem;
		user-select: none;
		white-space: pre-wrap;
		transition: transform 0.25s ease-in-out;
	}
	#cursor {
		position: absolute;
		height: 2rem;
		width: 2px;
		background-color: #a8b9e4;
		/* transition: transform 0.1s ease-in-out; */
	}
	#wordsInput {
		pointer-events: none;
		width: 10%;
		position: absolute;
		background: transparent;
		border: none;
		opacity: none;
		outline: none;
		color: transparent;
		user-select: none;
		cursor: default;
		margin-top: 0%;
	}
	.letter {
		margin-left: 2px;
	}
	#statusBar {
		width: 70%;
		display: grid;
	}
	#typingProgress {
		position: absolute;
		align-self: end;
		margin-bottom: 10px;
	}
	#configs {
		margin: auto;
		align-items: center;
	}

	.correct {
		color: white;
	}

	.incorrect {
		color: red;
	}

	@media only screen and (max-width: 767px) {
		#statusBar {
			width: 90%;
		}
		#overflow-placeholder {
			width: 90%;
		}
	}
</style>
