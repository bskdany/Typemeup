<script lang="ts">
	import '../global.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { TypingTestRunData } from '../types/interfaces';
	import { generateRandomWords, generateWordsAlgo } from '../algo/textGenerator';
	import Keyboard from '../components/typingTest/keyboard.svelte';
	import TypingProgress from '../components/typingTest/typingProgress.svelte';
	import TypingTest from '../components/typingTest/typingTest.svelte';
	import TypingResult from '../components/typingResult/typingResult.svelte';
	import { fetchBackend } from '../lib/fetch';
	import { getAccuracy, getWpm } from '../lib/typingTestRunHelper';
	import { getCombinedTypingEndMode, isLoggedIn, typingEndModes, userData } from '../shared/userData.svelte';
	import QuickConfigs from '../components/typingTest/quickConfigs.svelte';
	import { showToast } from '../shared/toastController.svelte';
	import FingetsStatisticsKeyboardChart from '../components/chart/fingetsStatisticsKeyboardChart.svelte';
	import { updateFingersStatistics } from '../algo/updateFingersStatistics';
	import type { KeypressData } from '../types/algo';
	import { generateKeypressData } from '../algo/generateKeypressData';

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

		if (userData.userTypingConfig.typingMode === 'test') {
			typingContextData.displayTypingTest = false;
		} else if (userData.userTypingConfig.typingMode === 'smart') {
			const fingersKeyPressData: KeypressData[][] = generateKeypressData(
				data.targetText,
				data.userTypedText,
				userData.userTypingConfig.smartModeConfig.fingerMap,
				userData.userTypingConfig.smartModeConfig.defaultFingersPosition,
				data.keyPressTimings
			);

			console.log(fingersKeyPressData);

			updateFingersStatistics(userData.fingersStatistics, fingersKeyPressData);

			console.log(userData.fingersStatistics);

			generateTargetText();
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
					fetchBackend(fetch, '/profile/saveFingersStatistics', {
						method: 'POST',
						body: {
							fingersStatistics: userData.fingersStatistics,
							fingerMap: userData.userTypingConfig.smartModeConfig.fingerMap,
							defaultFingersPosition: userData.userTypingConfig.smartModeConfig.defaultFingersPosition
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
			targetText = generateWordsAlgo(
				userData.fingersStatistics,
				userData.userTypingConfig.smartModeConfig.fingerMap,
				userData.userTypingConfig.typingEndWordMode
			);
		} else if (userData.userTypingConfig.typingMode === 'test') {
			if (userData.userTypingConfig.typingEndMode.startsWith('time')) {
				targetText = generateRandomWords(100);
			} else if (userData.userTypingConfig.typingEndMode.startsWith('words')) {
				targetText = generateRandomWords(userData.userTypingConfig.typingEndWordMode);
			}
		}

		console.log();
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
		<div id="keyboardWrapper">
			<Keyboard />
		</div>
	{:else if userData.userTypingConfig.typingMode === 'smart'}
		<div id="keyboardWrapper">
			<FingetsStatisticsKeyboardChart fingersStatistics={userData.fingersStatistics} />
		</div>
	{/if}
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
