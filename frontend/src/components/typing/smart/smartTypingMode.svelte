<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TypingTest from '../typingTest.svelte';
	import { userData } from '../../../shared/userData.svelte';
	import { generateWordsAlgo2 } from '../../../algo/textGenerator';
	import type { TypingTestRunData } from '../../../types/interfaces';
	import SmartTypingModeKeyboard from './smartTypingModeKeyboard.svelte';
	import type { KeypressData } from '@shared/types';
	import { generateKeypressData } from '../../../algo/generateKeypressData';
	import { updateKeyStatistics } from '../../../algo/updateKeyStatistics';
	import { fetchBackend } from '../../../lib/fetch';
	import { showToast } from '../../../shared/toastController.svelte';

	const { onTypingStart, onTypingEnd }: { onTypingStart: () => void; onTypingEnd: (data: TypingTestRunData) => void } = $props();
	let typingTestRef: TypingTest;
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

		typingTestRef?.focus();
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

<div style="display: grid; grid-template-rows: 1fr 1fr; ">
	{#key [resetTrigger, userData.userTypingConfig.typingEndWordMode]}
		<TypingTest
			targetText={generateWordsAlgo2($state.snapshot(userData.keyStatistics), userData.userTypingConfig.typingEndWordMode)}
			errorCorrectionMode={userData.userTypingConfig.errorCorrectionMode}
			typingEndMode="words"
			testStarted={onTypingStart}
			testEnded={handleTypingEnd}
			bind:this={typingTestRef}
		/>
	{/key}

	<SmartTypingModeKeyboard keyStats={$state.snapshot(userData.keyStatistics)} />
</div>
