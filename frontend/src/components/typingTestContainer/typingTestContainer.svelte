<script lang="ts">
	import '../../global.css';
	import TypingTest from './typingTest.svelte';
	import TypingResult from './typingResult.svelte';
	import Keyboard from './keyboard.svelte';
	import { onMount, setContext } from 'svelte';
	import TypingProgress from './typingProgress.svelte';
	import Configs from './configs.svelte';
	import type { TypingContextData } from '../../interfaces';

	let typingContextData: TypingContextData = $state({
		displayTypingTest: true,
		configTypingMode: 'words',
		configWordAmount: 10,
		configTimeAmount: 15,
		typingTestStatus: 'ended'
	});

	setContext('typingContext', {
		typingContextData: typingContextData
	});

	let resetTrigger: number = $state(0); // incrementing this will reset the typing test
	let typingTestRef: TypingTest;

	let targetText = ['hello', 'world'];

	function typingTestStarted() {
		// something
		console.log('Typing test started');
	}

	function typingTestEnded(data: { wpm: number }) {
		console.log(data.wpm);
		typingContextData.displayTypingTest = false;
	}

	function handleTabKeyDown(event: any) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (typingContextData.displayTypingTest) {
				resetTrigger += 1;
			} else {
				typingContextData.displayTypingTest = true;
			}

			typingTestRef.focus();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleTabKeyDown);
		// return () => {
		// 	unsubscribe;
		// 	document.removeEventListener('keydown', handleTabKeyDown);
		// };
	});
</script>

<div id="statusBar">
	{#if typingContextData.typingTestStatus === 'started'}
		<div id="typingProgress">
			<TypingProgress wordsTyped={0} timeTyped={0} />
		</div>
	{/if}
	<div id="configs">
		<Configs />
	</div>
</div>

{#key [resetTrigger, typingContextData.configWordAmount, typingContextData.configTimeAmount, typingContextData.configTypingMode]}
	{#if typingContextData.displayTypingTest}
		<TypingTest {targetText} errorCorrectionMode={1} testStarted={typingTestStarted} testEnded={typingTestEnded} bind:this={typingTestRef} />
		<div id="keyboardWrapper"><Keyboard /></div>
	{/if}
{/key}

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
