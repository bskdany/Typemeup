<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import TypingTest from '../typingTest.svelte';
	import { userData } from '../../../shared/userData.svelte';
	import { generateWordsAlgo2 } from '../../../algo/textGenerator';
	import type { TypingContext, TypingContextData, TypingTestRunData } from '../../../types/interfaces';
	import SmartTypingModeKeyboard from './smartTypingModeKeyboard.svelte';
	import type { KeypressData } from '@shared/types';
	import { generateKeypressData } from '../../../algo/generateKeypressData';
	import { updateKeyStatistics } from '../../../algo/updateKeyStatistics';
	import { fetchBackend } from '../../../lib/fetch';
	import { showToast } from '../../../shared/toastController.svelte';
	import TypingProgress from '../typingProgress.svelte';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;
	const { onTypingStart, onTypingEnd }: { onTypingStart: () => void; onTypingEnd: (data: TypingTestRunData) => void } = $props();
	let resetTrigger = $state(0); // incrementing this will reset the typing test

	function handleTypingEnd(typingTestRunData: TypingTestRunData) {
		// analysing the data received
		const keypressData: KeypressData[] = generateKeypressData(
			typingTestRunData.targetText,
			typingTestRunData.userTypedText,
			$state.snapshot(userData.userTypingConfig.smartModeConfig.fingerMap),
			$state.snapshot(userData.userTypingConfig.smartModeConfig.defaultFingersPosition),
			typingTestRunData.keyPressTimings
		);

		userData.keyStatistics = updateKeyStatistics($state.snapshot(userData.keyStatistics), keypressData);

		// saving the updated statistics
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

		onTypingEnd(typingTestRunData);

		resetTrigger += 1;
	}

	function handleTabKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			resetTrigger += 1;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleTabKeyDown);
	});

	onDestroy(() => {
		try {
			document.removeEventListener('keydown', handleTabKeyDown);
		} catch (e) {}
	});
</script>

<div style="display: grid; grid-template-rows: 1fr 2fr; ">
	{#key [resetTrigger, userData.userTypingConfig.typingEndWordMode, userData.userTypingConfig.typingLanguage]}
		<div>
			{#if typingContextData.typingTestStatus === 'started'}
				<TypingProgress />
			{:else}
				<div style="visibility: hidden;"><TypingProgress /></div>
			{/if}
			<TypingTest
				targetText={generateWordsAlgo2($state.snapshot(userData.keyStatistics), userData.userTypingConfig.typingEndWordMode)}
				errorCorrectionMode={userData.userTypingConfig.errorCorrectionMode}
				typingEndMode="words"
				testStarted={onTypingStart}
				testEnded={handleTypingEnd}
			/>
		</div>
	{/key}

	{#if userData.userTypingConfig.visualConfig.showSmartModeKeyboard}
		<SmartTypingModeKeyboard keyStats={$state.snapshot(userData.keyStatistics)} />
	{/if}
</div>
