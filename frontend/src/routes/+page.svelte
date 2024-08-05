<script lang="ts">
	import '../global.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { TypingTestRunData } from '../types/interfaces';
	import { analyse } from '../algo/textAnalysis';
	import { generateWords, generateWordsAlgo } from '../algo/textGenerator';
	import Keyboard from '../components/typingTest/keyboard.svelte';
	import TypingProgress from '../components/typingTest/typingProgress.svelte';
	import TypingTest from '../components/typingTest/typingTest.svelte';
	import TypingResult from '../components/typingResult/typingResult.svelte';
	import { fetchBackend } from '../lib/fetch';
	import { getAccuracy, getWpm } from '../lib/typingTestRunHelper';
	import { getCombinedTypingEndMode, isLoggedIn, typingEndModes, userData } from '../shared/userData.svelte';
	import QuickConfigs from '../components/typingTest/quickConfigs.svelte';

	let typingContextData = $state({
		displayTypingTest: true,
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

	function typingTestStarted() {
		// something
	}

	function typingTestEnded(data: TypingTestRunData) {
		typingTestRunData = data;

		if (isLoggedIn()) {
			try {
				fetchBackend(fetch, '/profile/saveTypingTest', {
					method: 'POST',
					body: {
						typingMode: userData.userTypingConfig.typingMode,
						typingEndMode: getCombinedTypingEndMode(),
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
		}

		if (userData.userTypingConfig.typingMode === 'test') {
			typingContextData.displayTypingTest = false;
		}

		if (userData.userTypingConfig.typingMode === 'smart') {
			const updatedFingerStatistics = analyse(
				userData.fingersStatistics,
				data.targetText,
				data.userTypedText,
				userData.userTypingConfig.smartModeConfig.fingerMap,
				userData.userTypingConfig.smartModeConfig.defaultFingersPosition
			);
			userData.fingersStatistics = updatedFingerStatistics;
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

	function resetTypingTest() {
		if (userData.userTypingConfig.typingEndMode.startsWith('time')) {
			targetText = generateWords(100);
		} else if (userData.userTypingConfig.typingEndMode.startsWith('words')) {
			targetText = generateWords(parseInt(userData.userTypingConfig.typingEndMode.split(' ')[1]) ?? 10);
			targetText = ['asdfasdfasdf'];
		}
	}

	$effect(() => {
		resetTrigger;
		userData.userTypingConfig.typingEndMode;
		userData.userTypingConfig.typingEndTimeMode;
		userData.userTypingConfig.typingEndWordMode;
		resetTypingTest();
	});

	onMount(() => {
		document.addEventListener('keydown', handleTabKeyDown);
	});

	onDestroy(() => {
		try {
			document.removeEventListener('keydown', handleTabKeyDown);
		} catch (e) {}
	});
</script>

{#if typingContextData.displayTypingTest}
	<div id="configs">
		<QuickConfigs />
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
				errorCorrectionMode={userData.userTypingConfig.errorCorrectionMode}
				typingEndMode={userData.userTypingConfig.typingEndMode}
				typingEndTimeMode={userData.userTypingConfig.typingEndTimeMode}
				typingEndWordMode={userData.userTypingConfig.typingEndWordMode}
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
