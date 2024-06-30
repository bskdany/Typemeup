<script lang="ts">
	import '../../global.css';
	import TypingTest from './typingTest.svelte';
	import TypingResult from './result/typingResult.svelte';
	import Keyboard from './keyboard.svelte';
	import { onMount, setContext } from 'svelte';
	import TypingProgress from './typingProgress.svelte';
	import Configs from './configs.svelte';
	import type { TypingContextData, UserTypingData } from '../../interfaces';
	import { generateWords } from '../../algo/textGenerator';
	import { getUserTypingData } from '../../storage/localStorageService';

	let typingContextData: TypingContextData = $state({
		displayTypingTest: true,
		configTypingMode: 'words',
		configWordAmount: 10,
		configTimeAmount: 15,
		typingTestStatus: 'ended',
		progressTimeElapsed: 0,
		progressWordsTyped: 0,
		livePressedKey: { key: '', count: 0 }
	});

	setContext('typingContext', {
		typingContextData: typingContextData
	});

	let resetTrigger: number = $state(0); // incrementing this will reset the typing test
	let typingTestRef: TypingTest;

	let targetText: string[] = [];

	const userTypingData: UserTypingData = getUserTypingData();

	function typingTestStarted() {
		// something
		console.log('Typing test started');
	}

	function typingTestEnded(data: { wpm: number }) {
		console.log(data.wpm);
		typingContextData.displayTypingTest = false;
		typingContextData.typingTestStatus = 'ended';
		typingContextData.livePressedKey.key = '';
	}

	function handleTabKeyDown(event: any) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (typingContextData.displayTypingTest) {
				resetTrigger += 1;
			} else {
				typingContextData.displayTypingTest = true;
			}
		}

		typingTestRef?.focus();
	}

	$effect(() => {
		resetTrigger;
		typingContextData.configWordAmount;
		typingContextData.configTimeAmount;
		typingContextData.configTypingMode;

		targetText = generateWords();
	});

	onMount(() => {
		document.addEventListener('keydown', handleTabKeyDown);
		// return () => {
		// 	unsubscribe;
		// 	document.removeEventListener('keydown', handleTabKeyDown);
		// };
	});
</script>

{#if typingContextData.displayTypingTest}
	<div id="configs">
		<Configs />
	</div>

	<div id="statusBar">
		{#if typingContextData.typingTestStatus === 'started'}
			<TypingProgress />
		{:else}
			<div style="visibility: hidden;"><TypingProgress /></div>
		{/if}
	</div>

	{#key [resetTrigger, typingContextData.configWordAmount, typingContextData.configTimeAmount, typingContextData.configTypingMode]}
		<div id="typingTestWrapper">
			<TypingTest {targetText} errorCorrectionMode={1} testStarted={typingTestStarted} testEnded={typingTestEnded} bind:this={typingTestRef} />
		</div>
	{/key}
	<div id="keyboardWrapper"><Keyboard /></div>
{:else}
	<div id="typingTestReport">
		<!-- <TypingResult /> -->
		<div>press tab to restart</div>
	</div>
{/if}

<style>
	#configs {
		display: flex;
		justify-content: center;
	}
	#keyboardWrapper {
		display: flex;
		justify-content: center;
	}
	#statusBar {
		display: flex;
		justify-content: left;
	}
	#typingTestWrapper {
		display: flex;
		justify-content: center;
		height: 30%;
		/* width: 80%; */
	}

	@media only screen and (max-width: 767px) {
		#keyboardWrapper {
			display: none;
		}
	}
</style>
