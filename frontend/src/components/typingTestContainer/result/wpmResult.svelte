<script lang="ts">
	const { wpm }: { wpm: number } = $props();
</script>

<div id="wpmResultTypingTest">WPM {wpm}</div>

<style>
	#wpmResultTypingTest {
		color: rgb(235, 226, 226);
		font-size: 1.5rem;
		border: solid;
		border-color: rgb(78, 71, 71);
		border-width: 2px;
		border-radius: 10px;
		padding: 1rem;
	}
</style>
