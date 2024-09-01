<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TypingTest from '../typingTest.svelte';
	import { userData } from '../../../shared/userData.svelte';
	import type { TypingTestRunData } from '../../../types/interfaces';
	import { generateRandomWords } from '../../../algo/textGenerator';
	import TypingTestModeKeyboard from './testTypingModeKeyboard.svelte';
	import TypingTestResult from './result/typingResult.svelte';

	const { onTypingStart, onTypingEnd }: { onTypingStart: () => void; onTypingEnd: (data: TypingTestRunData) => void } = $props();
	let typingTestRef: TypingTest;
	let resetTrigger = $state(0); // incrementing this will reset the typing test
	let displayTypingTest = $state(true);
	let typingTestRunData: TypingTestRunData;

	function handleTypingEnd(data: TypingTestRunData) {
		typingTestRunData = data;
		displayTypingTest = false;

		onTypingEnd(data);
	}

	function handleTabKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			resetTrigger += 1;
			displayTypingTest = true;
		}

		typingTestRef?.focus();
	}

	function restart() {
		// resetTrigger += 1;
		displayTypingTest = false;
		displayTypingTest = true;
	}

	$effect(() => {
		userData.userTypingConfig.typingEndTimeMode;
		userData.userTypingConfig.typingEndWordMode;
		restart();
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

{#key [resetTrigger, displayTypingTest]}
	{#if displayTypingTest}
		<div style="display: grid; grid-template-rows: 1fr 2fr;">
			{#if userData.userTypingConfig.typingEndMode === 'words'}
				<TypingTest
					targetText={generateRandomWords(userData.userTypingConfig.typingEndWordMode)}
					errorCorrectionMode={userData.userTypingConfig.errorCorrectionMode}
					typingEndMode="words"
					testStarted={onTypingStart}
					testEnded={handleTypingEnd}
					bind:this={typingTestRef}
				/>
			{:else if userData.userTypingConfig.typingEndMode === 'time'}
				<TypingTest
					targetText={generateRandomWords(300)}
					errorCorrectionMode={userData.userTypingConfig.errorCorrectionMode}
					typingEndMode="time"
					typingEndTimeMode={userData.userTypingConfig.typingEndTimeMode}
					testStarted={onTypingStart}
					testEnded={handleTypingEnd}
					bind:this={typingTestRef}
				/>
			{/if}

			<TypingTestModeKeyboard />
		</div>
	{:else}
		<TypingTestResult {typingTestRunData} {restart} />
	{/if}
{/key}
