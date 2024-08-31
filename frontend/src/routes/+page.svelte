<script lang="ts">
	import '../global.css';
	import { onDestroy, onMount, setContext } from 'svelte';
	import type { TypingTestRunData } from '../types/interfaces';
	import { fetchBackend } from '../lib/fetch';
	import { getAccuracy, getWpm } from '../lib/typingTestRunHelper';
	import { getCombinedTypingEndMode, hasInitialized, isLoggedIn, typingEndModes, userData } from '../shared/userData.svelte';
	import QuickConfigs from '../components/typing/quickConfigs.svelte';
	import { showToast } from '../shared/toastController.svelte';
	import { generateKeypressData } from '../algo/generateKeypressData';
	import { updateKeyStatistics } from '../algo/updateKeyStatistics';
	import type { KeypressData } from '@shared/types';
	import TypingTestLoad from '../components/typing/typingTestLoad.svelte';
	import CompetitionMode from '../components/typing/compete/competeTypingMode.svelte';
	import SmartTypingMode from '../components/typing/smart/smartTypingMode.svelte';
	import TestTypingMode from '../components/typing/test/testTypingMode.svelte';
	import TypingProgress from '../components/typing/typingProgress.svelte';

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

	function handleTypingStarted() {
		// something
	}

	function handleTypingEnded(typingTestRunData: TypingTestRunData) {
		if (isLoggedIn()) {
			try {
				fetchBackend(fetch, '/profile/saveTypingTest', {
					method: 'POST',
					body: {
						typingMode: userData.userTypingConfig.typingMode,
						typingEndMode: getCombinedTypingEndMode(),
						errorCorrectionMode: userData.userTypingConfig.errorCorrectionMode,
						targetText: typingTestRunData.targetText.flat().join(' '),
						timeTaken: typingTestRunData.timeTaken,
						timeStarted: typingTestRunData.timeStarted,
						timeEnded: typingTestRunData.timeEnded,
						wpm: getWpm(typingTestRunData),
						accuracy: getAccuracy(typingTestRunData)
					}
				});
			} catch (e) {
				console.error(e);
				showToast({ message: "Couldn't save typing data" });
			}
		}
	}
</script>

{#await hasInitialized()}
	<TypingTestLoad />
{:then}
	<div style="display: grid; grid-template-rows: 1fr 2fr; height: 100%;">
		<QuickConfigs />

		<div>
			<div id="statusBar">
				{#if typingContextData.typingTestStatus === 'started'}
					<TypingProgress />
				{:else}
					<div style="visibility: hidden;"><TypingProgress /></div>
				{/if}
			</div>
			{#if userData.userTypingConfig.typingMode === 'compete'}
				<CompetitionMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
			{:else if userData.userTypingConfig.typingMode === 'test'}
				<TestTypingMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
			{:else if userData.userTypingConfig.typingMode === 'smart'}
				<SmartTypingMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
			{/if}
		</div>
	</div>
{/await}

<style>
	#statusBar {
		margin-left: 0%;
	}
	#typingTestReport {
		width: 100%;
		height: 100%;
		/* display: flex; */
		/* justify-content: space-around; */
	}
</style>
