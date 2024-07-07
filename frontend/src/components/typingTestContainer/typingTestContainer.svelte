<script lang="ts">
	import '../../global.css';
	import TypingTest from './typingTest.svelte';
	import TypingResult from './result/typingResult.svelte';
	import Keyboard from './keyboard.svelte';
	import { onMount, setContext } from 'svelte';
	import TypingProgress from './typingProgress.svelte';
	import Configs from './configs.svelte';
	import type { FingerData, TypingTestRunData, TypingContextData, UserTypingData } from '../../interfaces';
	import { generateWords, generateWordsAlgo } from '../../algo/textGenerator';
	import { getUserTypingData } from '../../storage/localStorageService';
	import { analyse } from '../../algo/textAnalysis';
	import { updated } from '$app/stores';

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
	let typingTestRunData: TypingTestRunData;

	let targetText: string[] = $state([]);

	const userTypingData: UserTypingData = getUserTypingData();

	function typingTestStarted() {
		// something
		console.log('Typing test started');
	}

	function typingTestEnded(data: TypingTestRunData) {
		typingTestRunData = data;
		typingContextData.displayTypingTest = false;

		if (typingContextData.configTypingMode === 'smart') {
			const updatedFingerData = analyse(
				userTypingData.fingersStatistics,
				data.targetText,
				data.userTypedText,
				userTypingData.fingerMap,
				userTypingData.defaultFingersPosition
			);
			console.log(updatedFingerData);
			userTypingData.fingersStatistics = updatedFingerData;
		}
	}

	function handleTabKeyDown(event: any) {
		if (event.key === 'Tab') {
			event.preventDefault();
			typingContextData.displayTypingTest = true;
			resetTrigger += 1;
		}

		typingTestRef?.focus();
	}

	$effect(() => {
		resetTrigger;
		typingContextData.configWordAmount;
		typingContextData.configTimeAmount;
		typingContextData.configTypingMode;

		if (typingContextData.configTypingMode === 'time') {
			targetText = generateWords(100);
		} else if (typingContextData.configTypingMode === 'words') {
			// targetText = generateWords(typingContextData.configWordAmount);
			targetText = ['asdfasdfasdf'];
		} else if (typingContextData.configTypingMode === 'smart') {
			targetText = generateWordsAlgo(userTypingData, typingContextData.configWordAmount);
		}
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

	{#key targetText}
		<div id="typingTestWrapper">
			<TypingTest {targetText} errorCorrectionMode={3} testStarted={typingTestStarted} testEnded={typingTestEnded} bind:this={typingTestRef} />
		</div>
	{/key}
	<div id="keyboardWrapper"><Keyboard /></div>
{:else}
	<div id="typingTestReport">
		<TypingResult {typingTestRunData} restart={() => (typingContextData.displayTypingTest = true)} />
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

	#typingTestReport {
		width: 100%;
		height: 100%;
	}

	@media only screen and (max-width: 767px) {
		#keyboardWrapper {
			display: none;
		}
	}
</style>
