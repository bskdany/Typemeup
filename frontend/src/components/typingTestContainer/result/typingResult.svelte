<script lang="ts">
	import WpmResult from './wpmResult.svelte';

	function calculateWPM(correctCharCount: number, msTime: number) {
		return parseFloat(((correctCharCount / 5) * (60 / (msTime / 1000))).toFixed(2));
	}

	const { timeTaken, correctCharCount, restart }: { timeTaken: number; correctCharCount: number; restart: () => void } = $props();
</script>

<WpmResult wpm={calculateWPM(correctCharCount, timeTaken)} />
<div>Press TAB to restart</div>
<button id="restartButton" onclick={restart}>Restart</button>

<style>
	div {
		color: rgb(127, 106, 106);
		font-size: 1.5rem;
		margin-top: 50px;
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
		div {
			display: none;
		}
		#restartButton {
			display: block;
		}
	}
</style>
