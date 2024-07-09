<script lang="ts">
	import KeyPressTimingsChart from '../../chart/keyPressTimingsChart.svelte';
	import { TextObjectHandler } from '../textObjectHandler.svelte';

	const {
		targetText,
		userTypedText,
		typingTestKeypressTimings,
		errorCorrectionMode
	}: { targetText: string[]; userTypedText: string[]; typingTestKeypressTimings: number[]; errorCorrectionMode: number } = $props();

	let textObject: TextObjectHandler = $state(new TextObjectHandler(targetText, errorCorrectionMode));
	let simulateTypingTimeout: any = null;
	let playPauseButtonText: string = $state('Play');

	let remainingKeyPresses: string[] = [...userTypedText];
	let remainingKeyPressTimings: number[] = [...typingTestKeypressTimings];

	console.log(remainingKeyPresses);
	console.log(remainingKeyPressTimings);

	function simulateTyping(remainingKeyPresses: string[], remainingKeyPressTimings: number[]) {
		textObject.addKeyPressed(remainingKeyPresses[0]);
		if (remainingKeyPressTimings.length > 1) {
			const timing = remainingKeyPressTimings[0];
			remainingKeyPresses.shift();
			remainingKeyPressTimings.shift();
			simulateTypingTimeout = setTimeout(() => simulateTyping(remainingKeyPresses, remainingKeyPressTimings), timing);
		}
	}

	function handlePlayPauseButton() {
		if (playPauseButtonText === 'Play') {
			playPauseButtonText = 'Pause';
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

			remainingKeyPresses = [...userTypedText];
			remainingKeyPressTimings = [...typingTestKeypressTimings];
		}
	}
</script>

<div id="typingTestReplayContainer">
	<div id="controlBar">
		<button onclick={() => handlePlayPauseButton()}>{playPauseButtonText}</button>
		<button onclick={reset}>Reset</button>
	</div>
	<div id="mainText">
		{#each textObject?.textObject as word, index}
			<div class="word">
				{#each word.letters as { text, isCorrect, isSpace, isTyped }}
					<span class="letter {isSpace ? 'space' : ''} {isTyped && isCorrect ? 'correct' : ''} {isTyped && !isCorrect ? 'incorrect' : ''}">
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
		gap: 30px;
	}

	#controlBar {
		display: flex;
		gap: 10px;
	}

	#mainText {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.word {
		margin: none;
		padding: none;
		width: fit-content;
		color: rgb(127, 106, 106);
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
</style>
