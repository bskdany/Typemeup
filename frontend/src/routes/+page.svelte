<script lang="ts">
	import '../global.css';
	import { setContext } from 'svelte';
	import type { TypingTestRunData } from '../types/interfaces';
	import { fetchBackend } from '../lib/fetch';
	import { getAccuracy, getWpm } from '../lib/typingTestRunHelper';
	import { getCombinedTypingEndMode, hasInitialized, isLoggedIn, typingEndModes, userData } from '../shared/userData.svelte';
	import QuickConfigs from '../components/typing/quickConfigs.svelte';
	import { showToast } from '../shared/toastController.svelte';
	import CompetitionMode from '../components/typing/compete/competeTypingMode.svelte';
	import SmartTypingMode from '../components/typing/smart/smartTypingMode.svelte';
	import TestTypingMode from '../components/typing/test/testTypingMode.svelte';

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
						accuracy: getAccuracy(typingTestRunData),
						language: userData.userTypingConfig.typingLanguage
					}
				});
			} catch (e) {
				console.error(e);
				showToast({ message: "Couldn't save typing data" });
			}
		}
	}
</script>

<div style="display: grid; grid-template-rows: 1fr 2fr; height: 100%;">
	<div style="display: flex; flex-direction: column; justify-content: space-between;">
		<QuickConfigs />
	</div>

	{#if userData.userTypingConfig.typingMode === 'compete'}
		<CompetitionMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
	{:else if userData.userTypingConfig.typingMode === 'test'}
		<TestTypingMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
	{:else if userData.userTypingConfig.typingMode === 'smart'}
		<SmartTypingMode onTypingStart={handleTypingStarted} onTypingEnd={handleTypingEnded} />
	{/if}
</div>
