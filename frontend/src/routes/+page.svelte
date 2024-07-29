<script lang="ts">
	import '../global.css';
	import { updated } from '$app/stores';
	import { onMount, setContext } from 'svelte';
	import type { TypingContextData, TypingTestRunData, UserTypingData } from '../types/interfaces';
	import { analyse } from '../algo/textAnalysis';
	import { generateWords, generateWordsAlgo } from '../algo/textGenerator';
	import Configs from '../components/typingTest/quickConfigs.svelte';
	import Keyboard from '../components/typingTest/keyboard.svelte';
	// import TypingResult from '../components/typingResu';
	import TypingProgress from '../components/typingTest/typingProgress.svelte';
	import TypingTest from '../components/typingTest/typingTest.svelte';
	import TypingResult from '../components/typingResult/typingResult.svelte';
	import { userConfig } from '../userConfig.svelte';
	import { getData } from '../api/fetch';
	import { getAccuracy, getWpm } from '../components/typingTestRunHelper';
	import { getUserTypingData } from '../storage/localStorageService';

	let typingContextData = $state({
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
	}

	function typingTestEnded(data: TypingTestRunData) {
		typingTestRunData = data;

		try {
			getData('/profile/saveTypingTest', {
				method: 'POST',
				body: {
					typingMode:
						typingContextData.configTypingMode +
						' ' +
						(typingContextData.configTypingMode === 'time' ? typingContextData.configTimeAmount : typingContextData.configWordAmount),
					errorCorrectionMode: data.errorCorrectionMode,
					targetText: data.targetText.flat().join(' '),
					timeTaken: data.timeTaken,
					timeStarted: data.timeStarted,
					timeEnded: data.timeEnded,
					wpm: getWpm(typingTestRunData),
					accuracy: getAccuracy(typingTestRunData)
				}
			});
		} catch (e) {
			console.error(e);
		}

		typingContextData.displayTypingTest = false;

		if (typingContextData.configTypingMode === 'smart') {
			const updatedFingerData = analyse(
				userTypingData.fingersStatistics,
				data.targetText,
				data.userTypedText,
				userConfig.fingerMap,
				userConfig.defaultFingersPosition
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
			targetText = generateWords(typingContextData.configWordAmount);
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
			<TypingTest
				{targetText}
				errorCorrectionMode={userConfig.errorCorrectionMode}
				testStarted={typingTestStarted}
				testEnded={typingTestEnded}
				bind:this={typingTestRef}
			/>
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
