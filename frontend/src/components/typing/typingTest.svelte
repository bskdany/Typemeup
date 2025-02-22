<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { tweened } from 'svelte/motion';

	import type { ErrorCorrectionMode, UserTypingConfig } from '@shared/types';
	import type { TypingContext, TypingContextData, TypingTestRunData } from '../../types/interfaces';
	import { TextObjectHandler } from './textObjectHandler.svelte';

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
		errorCorrectionMode: ErrorCorrectionMode;
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

	let msTimeStart: number;
	let timeStartedIso: string;

	let msTimeAtLastKeyPress: number;
	let timeInterval: any = null;
	let timeProgressInterval: any = null;
	let timeEndTimeout: any = null;
	let isFocused = $state(true);

	function typingTestStarted() {
		msTimeStart = Date.now();
		msTimeAtLastKeyPress = Date.now();
		timeStartedIso = new Date().toISOString();

		typingContextData.progressTimeElapsed = 0;

		timeProgressInterval = setInterval(() => {
			typingContextData.progressTimeElapsed += 1;
		}, 1000);

		if (typingEndMode === 'time') {
			timeEndTimeout = setTimeout(() => {
				typingTestEnded();
			}, typingEndTimeMode * 1000);
		}
	}

	function typingTestEnded() {
		typingContextData.typingTestStatus = 'ended';
		typingContextData.livePressedKey.key = '';

		testEnded({
			timeTaken: typingEndMode === 'time' ? typingEndTimeMode * 1000 : Date.now() - msTimeStart,
			targetText: textObject.targetText.slice(0, textObject.wordIndex + 1),
			userTypedText: textObject.userTypedText,
			textObject: JSON.parse(JSON.stringify(textObject.textObject)), // deep copy
			errorCorrectionMode: errorCorrectionMode,
			timeStarted: timeStartedIso,
			timeEnded: new Date().toISOString(),
			correctKeyPresses: textObject.correctKeyPresses,
			totalKeyPresses: textObject.totalKeyPresses,
			keyPressTimings: textObject.keyPressTimings,
			keyPressCorrectness: textObject.keyPressCorrectness
		});
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

		handleCursor();
		checkIfMoveText();
		if (typingEndMode === 'words' && textObject.isEnd()) {
			typingTestEnded();
		}

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

	function focus() {
		if (typingTestInputBind && typingTestInputBind instanceof HTMLElement && document.activeElement != typingTestInputBind) {
			typingTestInputBind.focus();
			console.log('Input focused');
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
		clearInterval(timeProgressInterval);
		clearTimeout(timeEndTimeout);
	});
</script>

<div style="position:relative">
	{#if !isFocused}
		<div
			style="color: var(--text-color); text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); filter: drop-shadow(0px 1px 1px #000000);"
		>
			Click to focus
		</div>
	{/if}
	<div
		id="overflow-placeholder"
		role="button"
		style="height: {textHeight}px; {isFocused ? '' : 'filter: blur(3px)'};"
		onclick={() => {
			if (!isFocused) {
				focus();
			}
		}}
		onkeydown={() => focus()}
		tabindex="0"
	>
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
</div>

<input
	bind:this={typingTestInputBind}
	onfocusin={() => (isFocused = true)}
	onfocusout={() => (isFocused = false)}
	id="wordsInput"
	oninput={processKeyPress}
	autocomplete="off"
	autocorrect="off"
	autocapitalize="off"
	spellcheck="false"
/>

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
