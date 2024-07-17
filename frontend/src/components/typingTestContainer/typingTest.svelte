<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { TextObjectHandler } from './textObjectHandler.svelte';
	import { tweened } from 'svelte/motion';

	import type { TextObject, TypingContextData, TypingContext, TypingTestRunData } from '../../types/interfaces';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	typingContextData.progressWordsTyped = 0;
	typingContextData.progressTimeElapsed = 0;

	const {
		targetText,
		errorCorrectionMode,
		testStarted,
		testEnded
	}: {
		targetText: string[];
		errorCorrectionMode: number;
		testStarted: () => void;
		testEnded: (data: TypingTestRunData) => void;
	} = $props();

	let textObject: TextObjectHandler = $state(new TextObjectHandler(targetText, errorCorrectionMode));

	let cursorElementPositionX = tweened(0, { duration: 100 });
	let cursorElementPosition: { x: any; y: number } = $state({ x: cursorElementPositionX, y: 0 });

	let mainTextTranslateDistance: number = $state(0);
	let textHeight: number = $state(0);

	// element binds
	// let mainText: object[][] = [];
	let mainTextElement: HTMLElement;
	let textObjectBind: HTMLElement[] = $state([]);
	let cursorElement: HTMLElement;
	let typingTestInputBind: HTMLElement;

	let resizeObserver; // to handle mainText resizing

	let msTime = 0;
	let msTimeAtLastKeyPress: number;
	let timeInterval: any = null;

	const keyPressTimings: number[] = [];

	function typingTestStarted() {
		msTime = 0;
		msTimeAtLastKeyPress = Date.now();
		timeInterval = setInterval(() => {
			msTime += 10;
			if (msTime % 1000 === 0) {
				typingContextData.progressTimeElapsed += 1;
			}

			if (typingContextData.configTypingMode === 'time') {
				checkIfTestEnded();
			}
		}, 10);
	}

	function checkIfTestEnded() {
		if (
			((typingContextData.configTypingMode === 'words' || typingContextData.configTypingMode === 'smart') && textObject.isEnd()) ||
			(typingContextData.configTypingMode === 'time' && msTime > typingContextData.configTimeAmount * 1000)
		) {
			typingContextData.typingTestStatus = 'ended';
			typingContextData.livePressedKey.key = '';

			testEnded({
				timeTaken: msTime,
				targetText: textObject.targetText.slice(0, textObject.wordIndex + 1),
				userTypedText: textObject.userTypedText,
				keyPressTimings: keyPressTimings,
				textObject: JSON.parse(JSON.stringify(textObject.textObject)), // deep copy
				errorCorrectionMode: errorCorrectionMode
			});
		}
	}

	function processKeyPress(keydown: any) {
		const pressedKey = keydown.data;
		if (typingContextData.typingTestStatus != 'started') {
			typingContextData.typingTestStatus = 'started';
			typingTestStarted();
		}

		textObject.addKeyPressed(pressedKey);

		const msTimeSinceLastKeypress = Date.now() - msTimeAtLastKeyPress;
		msTimeAtLastKeyPress = Date.now();
		keyPressTimings.push(msTimeSinceLastKeypress);

		handleCursor();
		checkIfMoveText();
		checkIfTestEnded();

		typingContextData.livePressedKey.key = pressedKey;
		typingContextData.livePressedKey.count += 1;
		typingContextData.progressWordsTyped = textObject.wordIndex;
	}

	function handleCursor() {
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
			const cursorPositionX = cursorElement.getBoundingClientRect().left;
			const cursorPositionY = cursorElement.getBoundingClientRect().top;

			const newCursorPositionX = targetLetterNode.getBoundingClientRect().left - 2;
			const newCursorPositionY = targetLetterNode.getBoundingClientRect().top;

			const xOffset = newCursorPositionX - cursorPositionX;
			const yOffset = newCursorPositionY - cursorPositionY;

			$cursorElementPositionX += xOffset;
			cursorElementPosition.y += yOffset;
		} else {
			// Handle the case where the childNode is not an Element
			// throw 'Error moving cursor, child node is not an alement';
		}
	}

	function checkIfMoveText() {
		if (textObject.letterIndex === 0 && cursorElementPosition.y > 1 && textObject.hasMistaken === false) {
			mainTextTranslateDistance = -cursorElementPosition.y;
		}
	}

	export function focus() {
		if (typingTestInputBind && typingTestInputBind instanceof HTMLElement && document.activeElement != typingTestInputBind) {
			typingTestInputBind.focus();
		}
	}

	function calculateTextHeight() {
		const cleanedTextObjectBind: Element[] = [];
		for (const wordElement of textObjectBind) {
			if (wordElement.nodeType !== Node.COMMENT_NODE) {
				cleanedTextObjectBind.push(wordElement);
			}
		}

		if (cleanedTextObjectBind.length === 0) {
			// console.error("Can't calculate text height, no words");
			return 70;
		}

		let firstWordY = cleanedTextObjectBind[0].getBoundingClientRect().top;

		for (const wordElement of cleanedTextObjectBind) {
			const wordHeight = wordElement.getBoundingClientRect().top;
			if (wordHeight !== firstWordY) {
				return Math.abs(firstWordY - wordHeight) * 3;
			}
		}

		return 70; // just in case it doesn't find any, it doesn't really matter
	}

	$effect(() => {
		textObjectBind;
		textHeight = calculateTextHeight();
	});

	onMount(() => {
		typingContextData.typingTestStatus = 'pending';

		console.log('Typing test initialized');

		focus();

		// this is needed if the user resized the screen
		resizeObserver = new ResizeObserver(() => {
			handleCursor();
			mainTextTranslateDistance = -cursorElementPosition.y;
		});
		resizeObserver.observe(mainTextElement);
	});

	onDestroy(() => {
		clearInterval(timeInterval);
	});
</script>

<div id="overflow-placeholder" style="height: {textHeight}px;">
	<div id="main-text" style="transform: translateY({mainTextTranslateDistance}px)" bind:this={mainTextElement}>
		<div id="cursor" style="transform: translate({$cursorElementPositionX}px, {cursorElementPosition.y}px)" bind:this={cursorElement}></div>
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
		width: 100%;
		/* height: calc(6rem); */
		overflow: hidden;
	}
	#main-text {
		display: flex;
		flex-wrap: wrap;
		/* gap: 12px; */
		color: rgb(127, 106, 106);
		width: 100%;
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
		font-size: 2rem;
	}
	.correct {
		color: white;
	}

	.incorrect {
		color: red;
	}
</style>
