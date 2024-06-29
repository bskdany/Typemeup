<script lang="ts">
	import { initialiseRecording, recordKeystroke, stopRecordKeystroke } from '../../scripts/analiseKeyPresses';
	import { getContext, onDestroy, onMount } from 'svelte';
	import { wordSizeStore, pressedKeyStore, typingTestModeStore, typingTestTimeStore } from '../../scripts/stores';
	import Configs from './configs.svelte';
	import TypingProgress from './typingProgress.svelte';
	import { TextObjectHandler } from './textObjectHandler.svelte';
	import type { TextObject } from '../../interfaces';

	const typingContextData = getContext('typingContext').typingContextData;

	const {
		targetText,
		errorCorrectionMode,
		testStarted,
		testEnded
	}: {
		targetText: string[];
		errorCorrectionMode: number;
		testStarted: () => void;
		testEnded: (data: { wpm: number }) => void;
	} = $props();

	let textObject: TextObjectHandler = $state(new TextObjectHandler(targetText, errorCorrectionMode));

	let cursorElementPosition: { x: number; y: number } = $state({ x: 0, y: 0 });
	let mainTextTranslateDistance: number = 0;

	// element binds
	// let mainText: object[][] = [];
	let mainTextElement: HTMLElement;
	let textObjectBind: HTMLElement[] = [];
	let cursorElement: HTMLElement;
	let typingTestInputBind: HTMLElement;

	let resizeObserver; // to handle mainText resizing

	let msTime = 0;
	let secondsTime = 0;

	function typingTestStarted() {
		msTime = 0;
		setInterval(() => {
			msTime += 10;
			if (msTime % 1000 === 0) {
				secondsTime += 1;
			}
			checkIfTestEnded();
			// checkIfMoveText();
		}, 10);
	}

	function checkIfTestEnded() {
		if (typingContextData.configTestMode === 'words') {
			if (textObject.isEnd()) {
				testEnded({ wpm: 0 });
			}
		} else if (typingContextData.configTypingMode === 'time' && msTime > typingContextData.configTimeAmount * 1000) {
			testEnded({ wpm: 0 });
		}
	}

	function processKeyPress(keydown: any) {
		const pressedKey = keydown.data;
		if (typingContextData.typingStatus != 'started') {
			typingContextData.typingStatus = 'started';
			typingTestStarted();
		}

		textObject.addKeyPressed(pressedKey);
		handleCursor();
		checkIfTestEnded();
	}

	function handleCursor() {
		if (!cursorElement) {
			return;
		}

		const cursorPositionX = cursorElement.getBoundingClientRect().left;
		const cursorPositionY = cursorElement.getBoundingClientRect().top;

		let newCursorPositionX = 0;
		let newCursorPositionY = 0;

		// why me
		const cleanedTextObjectBind: any = [];
		for (let wordCounter = 0; wordCounter < textObjectBind.length; wordCounter++) {
			if (textObjectBind[wordCounter].nodeType !== Node.COMMENT_NODE) {
				cleanedTextObjectBind.push([]);
				for (const letter of textObjectBind[wordCounter].childNodes) {
					if (letter.nodeType !== Node.COMMENT_NODE) {
						cleanedTextObjectBind[wordCounter].push(letter);
					}
				}
			}
		}

		const targetLetterNode = cleanedTextObjectBind[textObject.wordIndex][textObject.letterIndex];

		if (targetLetterNode) {
			const rect = targetLetterNode.getBoundingClientRect();
			newCursorPositionX = rect.left;
			newCursorPositionY = rect.top;
		} else {
			// Handle the case where the childNode is not an Element
			// throw 'Error moving cursor, child node is not an alement';
		}

		const xOffset = newCursorPositionX - cursorPositionX;
		const yOffset = newCursorPositionY - cursorPositionY;

		cursorElementPosition.x += xOffset;
		cursorElementPosition.y += yOffset;
	}

	function checkIfMoveText() {
		if (textObject.letterIndex === 0 && cursorElementPosition.y > 1 && textObject.hasMistaken === false) {
			// 10 is arbitrary
			mainTextTranslateDistance = -cursorElementPosition.y;
		}
	}

	export function focus() {
		if (typingTestInputBind && typingTestInputBind instanceof HTMLElement) {
			typingTestInputBind.focus();
			console.log('Focus moved to typing test input');
		}
	}

	onMount(() => {
		focus();

		// this is needed if the user resized the screen
		resizeObserver = new ResizeObserver(() => {
			// handleCursor();
			mainTextTranslateDistance = -cursorElementPosition.y;
		});
		resizeObserver.observe(mainTextElement);
	});

	onDestroy(() => {
		typingContextData.startedTyping = false;
	});
</script>

<div id="overflow-placeholder">
	<div id="main-text" style="transform: translateY({mainTextTranslateDistance}px)" bind:this={mainTextElement}>
		<div id="cursor" style={`transform: translate(${cursorElementPosition.x}px, ${cursorElementPosition.y}px)`} bind:this={cursorElement}></div>
		{#each textObject?.textObject as word, index}
			<div class="word" bind:this={textObjectBind[index]}>
				{#each word.letters as { text, isCorrect, isSpace, isTyped }}
					<span class="letter {isSpace ? 'space' : ''} {isTyped && isCorrect ? 'correct' : ''} {isTyped && !isCorrect ? 'incorrect' : ''}">
						{text}
					</span>
				{/each}
			</div>
		{/each}
	</div>
</div>

<input bind:this={typingTestInputBind} id="wordsInput" oninput={processKeyPress} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />

<style>
	.word {
		margin: none;
		padding: none;
		width: fit-content;
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
	.correct {
		color: white;
	}

	.incorrect {
		color: red;
	}

	@media only screen and (max-width: 767px) {
		#overflow-placeholder {
			width: 90%;
		}
	}
</style>
