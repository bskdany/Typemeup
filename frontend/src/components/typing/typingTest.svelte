<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	import { userData } from '../../shared/userData.svelte';
	import type { UserConfig } from 'vite';
	import type { UserTypingConfig } from '@shared/types';
	import type { TypingContext, TypingContextData, TypingTestRunData } from '../../types/interfaces';
	import { TextObjectHandler } from './textObjectHandler.svelte';
	// import { TextObjectHandler } from './textObjectHandler.svelte';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	typingContextData.progressWordsTyped = 0;
	typingContextData.progressTimeElapsed = 0;

	const {
		targetText,
		errorCorrectionMode,
		typingEndMode,
		typingEndTimeMode = 0,
		testStarted,
		testEnded,
		onProgress,
		inputBlocked = false
	}: {
		targetText: string[];
		errorCorrectionMode: number;
		typingEndMode: UserTypingConfig['typingEndMode'];
		typingEndTimeMode?: number;
		testStarted?: () => void;
		testEnded: (data: TypingTestRunData) => void;
		onProgress?: (progress: number) => void;
		inputBlocked?: boolean;
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
	let timeStarted: string;

	const keyPressTimings: number[] = [];

	function typingTestStarted() {
		msTime = 0;
		msTimeAtLastKeyPress = Date.now();
		timeStarted = new Date().toISOString();
		timeInterval = setInterval(() => {
			msTime += 10;
			if (msTime % 1000 === 0) {
				typingContextData.progressTimeElapsed += 1;
			}

			if (typingEndMode === 'time') {
				checkIfTestEnded();
			}
		}, 10);
	}

	function checkIfTestEnded() {
		if ((typingEndMode === 'words' && textObject.isEnd()) || (typingEndMode === 'time' && msTime > typingEndTimeMode * 1000)) {
			typingContextData.typingTestStatus = 'ended';
			typingContextData.livePressedKey.key = '';

			testEnded({
				timeTaken: msTime,
				targetText: textObject.targetText.slice(0, textObject.wordIndex + 1),
				userTypedText: textObject.userTypedText,
				keyPressTimings: keyPressTimings,
				textObject: JSON.parse(JSON.stringify(textObject.textObject)), // deep copy
				errorCorrectionMode: errorCorrectionMode,
				timeStarted: timeStarted,
				timeEnded: new Date().toISOString(),
				correctKeyPresses: textObject.correctKeyPresses,
				totalKeyPresses: textObject.totalKeyPresses
			});
		}
	}

	function getProgress() {
		return Math.round((textObject.globalLetterIndex / targetText.join(' ').length) * 100);
	}

	function processKeyPress(keydown: any) {
		if (inputBlocked) {
			return;
		}

		let pressedKey = keydown.data;

		if (!pressedKey) {
			if (keydown.inputType === 'deleteContentBackward') {
				pressedKey = 'backspace';
			} else if (keydown.inputType === 'deleteWordBackward') {
				pressedKey = 'backspaceWord';
			}
		}

		if (typingContextData.typingTestStatus != 'started') {
			typingContextData.typingTestStatus = 'started';
			typingTestStarted();
		}

		textObject.addKeyPressed(pressedKey);

		onProgress?.(getProgress());

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
		if (!cursorElement || !textObjectBind) {
			return;
		}

		// why me
		const cleanedTextObjectBind: HTMLElement[] = [];
		for (const wordElement of textObjectBind) {
			for (const letterElement of wordElement.childNodes) {
				if (letterElement.nodeType === Node.ELEMENT_NODE) {
					cleanedTextObjectBind.push(letterElement as HTMLElement);
				}
			}
		}

		const targetLetterNode = cleanedTextObjectBind[textObject.globalLetterIndex];

		if (targetLetterNode) {
			const cursorPositionX = cursorElement.getBoundingClientRect().left;
			const cursorPositionY = cursorElement.getBoundingClientRect().top;

			const newCursorPositionX = targetLetterNode.getBoundingClientRect().left;
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
		mainTextTranslateDistance = -cursorElementPosition.y;
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

		return Math.abs(cleanedTextObjectBind[0].getBoundingClientRect().bottom - cleanedTextObjectBind[0].getBoundingClientRect().top) * 3;
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
		<div
			id="cursor"
			style="height:{textHeight / 3}px; transform: translate({$cursorElementPositionX}px, {cursorElementPosition.y}px)"
			bind:this={cursorElement}
		></div>
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
		width: fit-content;
	}

	#overflow-placeholder {
		width: 100%;
		overflow: hidden;
	}
	#main-text {
		display: flex;
		flex-wrap: wrap;
		color: var(--secondary-color);
		width: 100%;
		user-select: none;
		white-space: pre-wrap;
		transition: transform 0.25s ease-in-out;
	}
	#cursor {
		position: absolute;
		width: 2px;
		z-index: 100;
		background-color: var(--accent-color);
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
		/* margin-left: 2px; */
		font-size: 2rem;
	}
	.correct {
		color: var(--accent-color);
	}

	.incorrect {
		color: red;
	}

	.space.incorrect {
		background-color: red;
	}
</style>
