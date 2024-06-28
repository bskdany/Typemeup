<script lang="ts">
	import '../../global.css';
	import TypingTest from './typingTest.svelte';
	import TypingResult from './typingResult.svelte';
	import Keyboard from './keyboard.svelte';
	import { onMount, setContext } from 'svelte';

	let typingContextData = $state({
		displayTypingTest: true,
		configTypingMode: 'time',
		configWordAmount: 10,
		configTimeAmount: 15
	});

	setContext('typingContext', {
		typingContextData: typingContextData
	});

	let typingTestRef: TypingTest;

	let targetText = ['hello', 'world'];

	function processTypingTestData(data: { wpm: number }) {
		console.log(data.wpm);
	}

	// function getTyp	// function getTypingTestWpm(newValue: any) {
	// 	typingTestWpm = newValue.detail;
	// 	mode.set((currentMode = 'typingResult'));
	// }ingTestWpm(newValue: any) {
	// 	typingTestWpm = newValue.detail;
	// 	mode.set((currentMode = 'typingResult'));
	// }

	// function handleTabKeyDown(event: any) {
	// 	if (event.key === 'Tab') {
	// 		event.preventDefault();
	// 		if (currentMode === 'typingTest') {
	// 			resetTyping();
	// 		} else {
	// 			mode.set((currentMode = 'typingTest'));
	// 		}
	// 	}

	// 	typingTestRef.focus();
	// }

	onMount(() => {
		// document.addEventListener('keydown', handleTabKeyDown);
		// return () => {
		// 	unsubscribe;
		// 	document.removeEventListener('keydown', handleTabKeyDown);
		// };
	});
</script>

{#if typingContextData.displayTypingTest}
	<TypingTest
		{targetText}
		errorCorrectionMode={1}
		testEnded={() => console.log('a')}
		bind:this={typingTestRef}
	/>
	<div id="keyboardWrapper"><Keyboard /></div>
{:else}
	<!-- <TypingResult {0} on:restartTrigger={() => mode.set((currentMode = 'typingTest'))} /> -->
{/if}

<style>
	#profilePage {
		position: absolute;
		right: 30px;
		top: 30px;
	}

	@media only screen and (max-width: 767px) {
		#keyboardWrapper {
			display: none;
		}
	}
</style>
