<script lang="ts">
	import TextContainer from '../../common/textContainer.svelte';

	let pressTabToRestartElement: any;

	function calculateWPM(correctCharCount: number, msTime: number) {
		return parseFloat(((correctCharCount / 5) * (60 / (msTime / 1000))).toFixed(2));
	}

	const { timeTaken, correctCharCount, restart }: { timeTaken: number; correctCharCount: number; restart: () => void } = $props();
</script>

<div id="typingResult">
	<TextContainer input={'WPM: ' + calculateWPM(correctCharCount, timeTaken)} />
	<div id="desktop-view">
		<TextContainer input={'Press Tab to restart'} />
	</div>
	<button id="restartButton" onclick={restart}>Restart</button>
</div>

<style>
	#typingResult {
		display: flex;
		justify-content: top;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		gap: 30%;
	}

	#restartButton {
		display: none;
		color: rgb(127, 106, 106);
		font-size: 1rem;
		border: none;
		background-color: #2c2e31;
		padding: 10px;
		border: solid 1px transparent;
		border-radius: 10px;
		margin-top: 30px;
	}
	#restartButton:hover {
		color: #a8b9e4;
	}

	@media only screen and (max-width: 767px) {
		#desktop-view {
			display: none;
		}
		#restartButton {
			display: block;
		}
	}
</style>
