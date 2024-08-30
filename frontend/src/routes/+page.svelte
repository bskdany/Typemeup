<script lang="ts">
	import '../global.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { TypingTestRunData } from '../types/interfaces';
	// import { generateRandomWords generateWordsAlgo } from '../algo/textGenerator';
	import Keyboard from '../components/typingTest/keyboard.svelte';
	import TypingProgress from '../components/typingTest/typingProgress.svelte';
	import TypingTest from '../components/typingTest/typingTest.svelte';
	import TypingResult from '../components/typingResult/typingResult.svelte';
	import { fetchBackend } from '../lib/fetch';
	import { getAccuracy, getWpm } from '../lib/typingTestRunHelper';
	import { getCombinedTypingEndMode, hasInitialized, isLoggedIn, typingEndModes, userData } from '../shared/userData.svelte';
	import QuickConfigs from '../components/typingTest/quickConfigs.svelte';
	import { showToast } from '../shared/toastController.svelte';
	import FingetsStatisticsKeyboardChart from '../components/chart/keyStatisticsKeyboardChart.svelte';
	import { generateKeypressData } from '../algo/generateKeypressData';
	import { updateKeyStatistics } from '../algo/updateKeyStatistics';
	import { generateRandomWords, generateWordsAlgo2 } from '../algo/textGenerator';
	import type { KeypressData } from '@shared/types';
	import TypingTestLoad from '../components/typingTest/typingTestLoad.svelte';

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

	const { data } = $props();
	let resetTrigger: number = $state(0); // incrementing this will reset the typing test
	let typingTestRef: TypingTest;
	let typingTestRunData: TypingTestRunData;

	let targetText: string[] = $state([]);

	function typingTestStarted() {
		// something
	}

	function typingTestEnded(data: TypingTestRunData) {
		typingTestRunData = data;

		if (userData.userTypingConfig.typingMode === 'test') {
			typingContextData.displayTypingTest = false;
		} else if (userData.userTypingConfig.typingMode === 'smart') {
			const keypressData: KeypressData[] = generateKeypressData(
				data.targetText,
				data.userTypedText,
				$state.snapshot(userData.userTypingConfig.smartModeConfig.fingerMap),
				$state.snapshot(userData.userTypingConfig.smartModeConfig.defaultFingersPosition),
				data.keyPressTimings
			);

			console.log(keypressData);
			userData.keyStatistics = updateKeyStatistics($state.snapshot(userData.keyStatistics), keypressData);
			// console.log(userData.keyStatistics);

			resetTrigger += 1;
		}

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
				showToast({ message: "Couldn't save typing data" });
			}

			if (userData.userTypingConfig.typingMode === 'smart') {
				try {
					fetchBackend(fetch, '/profile/saveKeyStatistic', {
						method: 'POST',
						body: {
							keyStatistics: Array.from(userData.keyStatistics)
						}
					});
				} catch (e) {
					console.error(e);
					showToast({ message: "Couldn't save fingers statistics" });
				}
			}
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

	function generateTargetText() {
		if (userData.userTypingConfig.typingMode === 'smart') {
			targetText = generateWordsAlgo2($state.snapshot(userData.keyStatistics), userData.userTypingConfig.typingEndWordMode);
		} else if (userData.userTypingConfig.typingMode === 'test') {
			if (userData.userTypingConfig.typingEndMode.startsWith('time')) {
				targetText = generateRandomWords(300);
			} else if (userData.userTypingConfig.typingEndMode.startsWith('words')) {
				targetText = generateRandomWords(userData.userTypingConfig.typingEndWordMode);
			}
		}
	}

	$effect(() => {
		resetTrigger;
		userData.userTypingConfig.typingMode;
		userData.userTypingConfig.typingEndMode;
		userData.userTypingConfig.typingEndTimeMode;
		userData.userTypingConfig.typingEndWordMode;
		generateTargetText();
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

{#await hasInitialized()}
	<TypingTestLoad />
{:then}
	<div style="display: flex; flex-direction: column; height: 100%; width: 100%; justify-content: center; align-items: center;">
		<div>
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

				{#if userData.userTypingConfig.typingMode === 'test'}
					<div id="keyboardWrapper" style={!userData.userTypingConfig.visualConfig.showLiveKeypressKeyboard ? 'visibility: hidden;' : 'display: flex;'}>
						<Keyboard />
					</div>
				{:else if userData.userTypingConfig.typingMode === 'smart'}
					<div id="keyboardWrapper" style={!userData.userTypingConfig.visualConfig.showSmartModeKeyboard ? 'visibility: hidden;' : 'display: flex;'}>
						<FingetsStatisticsKeyboardChart keyStats={userData.keyStatistics} />
					</div>
				{/if}
			{:else}
				<div id="typingTestReport">
					<TypingResult {typingTestRunData} restart={() => (typingContextData.displayTypingTest = true)} />
				</div>
			{/if}
		</div>
	</div>
{/await}

<style>
	#configs {
		display: flex;
		justify-content: center;
	}
	#keyboardWrapper {
		display: flex;
		justify-content: center;
		margin-top: 10%;
		/* margin-top: var(--spacing-medium); */
	}
	#statusBar {
		display: flex;
		justify-content: left;
	}
	#typingTestWrapper {
		display: flex;
		justify-content: center;
		height: fit-content;
	}

	#typingTestReport {
		width: 100%;
		height: 100%;
		/* display: flex; */
		/* justify-content: space-around; */
	}

	@media only screen and (max-width: 767px) {
		#keyboardWrapper {
			display: none;
		}
	}
</style>
