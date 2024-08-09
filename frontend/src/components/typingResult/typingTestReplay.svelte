<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import type { TypingResultContext, TypingResultContextData } from '../../types/interfaces';
	import { TextObjectHandler } from '../typingTest/textObjectHandler.svelte';

	const {
		targetText,
		userTypedText,
		typingTestKeypressTimings,
		errorCorrectionMode
	}: { targetText: string[]; userTypedText: string[]; typingTestKeypressTimings: number[]; errorCorrectionMode: number } = $props();

	const typingResultContext: TypingResultContext = getContext('typingResultContext');
	const typingResultContextData: TypingResultContextData = typingResultContext.typingResultContextData;

	let textObject: TextObjectHandler = $state(new TextObjectHandler(targetText, errorCorrectionMode));
	let simulateTypingTimeout: any = null;
	let playPauseButtonText: string = $state('Play');

	let remainingKeyPresses: string[] = [...userTypedText];
	let remainingKeyPressTimings: number[] = [...typingTestKeypressTimings];

	function simulateTyping(remainingKeyPresses: string[], remainingKeyPressTimings: number[]) {
		textObject.addKeyPressed(remainingKeyPresses[0]);
		typingResultContextData.activeLetterId = textObject.globalLetterIndex;
		if (remainingKeyPressTimings.length > 1) {
			const timing = remainingKeyPressTimings[0];
			remainingKeyPresses.shift();
			remainingKeyPressTimings.shift();
			simulateTypingTimeout = setTimeout(() => simulateTyping(remainingKeyPresses, remainingKeyPressTimings), timing);
		} else {
			reset();
		}
	}

	function completeTest() {
		for (const keyPress of userTypedText) {
			textObject.addKeyPressed(keyPress);
		}
	}

	function handlePlayPauseButton() {
		typingResultContextData.typingTestReplayStatus = 'active';
		if (playPauseButtonText === 'Play') {
			playPauseButtonText = 'Pause';
			if (simulateTypingTimeout === null) {
				textObject = new TextObjectHandler(targetText, errorCorrectionMode);
			}
			simulateTyping(remainingKeyPresses, remainingKeyPressTimings);
		} else if (playPauseButtonText === 'Pause') {
			clearTimeout(simulateTypingTimeout);
			playPauseButtonText = 'Play';
		}
	}

	function reset() {
		if (simulateTypingTimeout !== null) {
			clearTimeout(simulateTypingTimeout);
			simulateTypingTimeout = null;
			textObject = new TextObjectHandler(targetText, errorCorrectionMode);
			playPauseButtonText = 'Play';
			completeTest();

			remainingKeyPresses = [...userTypedText];
			remainingKeyPressTimings = [...typingTestKeypressTimings];
			typingResultContextData.typingTestReplayStatus = 'inactive';
		}
	}

	completeTest();
</script>

<div id="typingTestReplayContainer">
	<div id="controlBar">
		<button onclick={() => handlePlayPauseButton()}>{playPauseButtonText}</button>
		<button onclick={reset}>Reset</button>
	</div>
	<div id="mainText">
		{#each textObject?.textObject as word, index}
			<div class="word">
				<!-- svelte-ignore a11y_mouse_events_have_key_events -->
				{#each word.letters as { text, isCorrect, isSpace, isTyped, id }}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						onmouseover={() => {
							typingResultContextData.activeLetterId = id;
						}}
						class="letter {isSpace ? 'space' : ''} {isTyped && isCorrect ? 'correct' : ''} {isTyped && !isCorrect ? 'incorrect' : ''}"
					>
						{text}
					</span>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	#typingTestReplayContainer {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-medium);
		white-space: pre-wrap;
	}

	#controlBar {
		display: flex;
		gap: var(--spacing-medium);
	}

	#mainText {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.word {
		margin: none;
		width: fit-content;
		color: var(--secondary-color);
	}

	.letter {
		margin-left: 2px;
		font-size: 1rem;
	}
	.correct {
		color: white;
	}

	.incorrect {
		color: red;
	}

	button {
		min-width: 70px;
	}
	.space.incorrect {
		background-color: red;
	}
</style>
