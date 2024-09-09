<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import type { TypingResultContext, TypingResultContextData, TypingTestRunData } from '../../../../types/interfaces';
	import { TextObjectHandler } from '../../textObjectHandler.svelte';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	const typingResultContext: TypingResultContext = getContext('typingResultContext');
	const typingResultContextData: TypingResultContextData = typingResultContext.typingResultContextData;

	let textObject: TextObjectHandler = $state(new TextObjectHandler(typingTestRunData.targetText, typingTestRunData.errorCorrectionMode));
	let userTypedTextObject: TextObjectHandler = $state(
		new TextObjectHandler(groupTextByWords(typingTestRunData.userTypedText), typingTestRunData.errorCorrectionMode)
	);

	let simulateTypingTimeout: any = null;
	let playPauseButtonText: string = $state('Play');

	let remainingKeyPresses: string[] = [...typingTestRunData.userTypedText];
	let remainingKeyPressTimings = makeKeyPressTimingsRelative(typingTestRunData.keyPressTimings);

	function simulateTyping(remainingKeyPresses: string[], remainingKeyPressTimings: number[]) {
		textObject.addKeyPressed(remainingKeyPresses[0]);
		userTypedTextObject.addKeyPressed(remainingKeyPresses[0]);
		typingResultContextData.activeLetterId = userTypedTextObject.globalLetterIndex;
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
		for (const keyPress of typingTestRunData.userTypedText) {
			textObject.addKeyPressed(keyPress);
			userTypedTextObject.addKeyPressed(keyPress);
		}
	}

	function groupTextByWords(text: string[]) {
		return text.reduce<string[]>((accumulator, value, index) => {
			if (index === 0) {
				accumulator.push('');
			}

			if (value === ' ') {
				accumulator.push('');
			} else {
				accumulator[accumulator.length - 1] += value;
			}
			return accumulator;
		}, []);
	}

	function handlePlayPauseButton() {
		typingResultContextData.typingTestReplayStatus = 'active';
		if (playPauseButtonText === 'Play') {
			playPauseButtonText = 'Pause';
			if (simulateTypingTimeout === null) {
				textObject = new TextObjectHandler(typingTestRunData.targetText, typingTestRunData.errorCorrectionMode);
				userTypedTextObject = new TextObjectHandler(groupTextByWords(typingTestRunData.userTypedText), typingTestRunData.errorCorrectionMode);
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
			textObject = new TextObjectHandler(typingTestRunData.targetText, typingTestRunData.errorCorrectionMode);
			userTypedTextObject = new TextObjectHandler(groupTextByWords(typingTestRunData.userTypedText), typingTestRunData.errorCorrectionMode);
			playPauseButtonText = 'Play';
			completeTest();

			remainingKeyPresses = [...typingTestRunData.userTypedText];
			remainingKeyPressTimings = makeKeyPressTimingsRelative(typingTestRunData.keyPressTimings);
			typingResultContextData.typingTestReplayStatus = 'inactive';
		}
	}

	function makeKeyPressTimingsRelative(keyPressTimings: number[]) {
		if (keyPressTimings.length === 0) {
			return [];
		}
		let lastTime = keyPressTimings[0];

		const relativeKeyPressTimings: number[] = [];
		for (let time of keyPressTimings) {
			relativeKeyPressTimings.push(time - lastTime);
			lastTime = time;
		}

		return relativeKeyPressTimings;
	}

	completeTest();
</script>

<div id="typingTestReplayContainer">
	<div>
		<span> Target text</span>
		<span id="replayText">
			{#each textObject?.textObject as word, index}
				<div class="word">
					<!-- svelte-ignore a11y_mouse_events_have_key_events -->
					{#each word.letters as { text, isCorrect, isSpace, isTyped, id }}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="letter {isSpace ? 'space' : ''} {isTyped && isCorrect ? 'correct' : ''} {isTyped && !isCorrect ? 'incorrect' : ''}">
							{text}
						</span>
					{/each}
				</div>
			{/each}
		</span>
	</div>

	<div>
		<span> User typed text</span>
		<span id="replayText">
			{#each userTypedTextObject?.textObject as word, index}
				<div class="word">
					<!-- svelte-ignore a11y_mouse_events_have_key_events -->
					{#each word.letters as { text, isCorrect, isSpace, isTyped, id }}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							onmouseover={() => {
								typingResultContextData.activeLetterId = id;
							}}
							class="letter {isSpace ? 'space' : ''} {isTyped && typingTestRunData.keyPressCorrectness[id] ? 'correct' : ''} {isTyped &&
							!typingTestRunData.keyPressCorrectness[id]
								? 'incorrect'
								: ''}"
						>
							{text}
						</span>
					{/each}
				</div>
			{/each}
		</span>
	</div>

	<div id="controlBar">
		<button onclick={() => handlePlayPauseButton()}>{playPauseButtonText}</button>
		<button onclick={reset}>Reset</button>
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

	#replayText {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.word {
		margin: none;
		width: fit-content;
		color: var(--text-color);
	}

	.letter {
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
