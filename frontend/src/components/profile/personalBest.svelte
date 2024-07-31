<script lang="ts">
	import type { PastTypingTestResult } from '../../types/interfaces';
	import BubbleContainer from '../common/bubbleContainer.svelte';
	import SingleDataContainer from '../common/singleDataContainer.svelte';

	const { pastTypingTestResult }: { pastTypingTestResult: PastTypingTestResult[] } = $props();

	const personalBestData = {
		'time 15': 0,
		'time 30': 0,
		'time 60': 0,
		'time 120': 0,
		'words 10': 0,
		'words 25': 0,
		'words 50': 0,
		'words 100': 0
	};

	for (const typingResult of pastTypingTestResult) {
		let typingMode = typingResult.typingMode as keyof typeof personalBestData;
		if (typingResult.wpm >= personalBestData[typingMode]) {
			personalBestData[typingMode] = typingResult.wpm;
		}
	}
</script>

<div id="personalBestWrapper">
	<BubbleContainer>
		{#each Object.entries(personalBestData).slice(0, 4) as entry, index}
			<SingleDataContainer title={entry[0]} data={entry[1]} />
		{/each}
	</BubbleContainer>

	<BubbleContainer>
		{#each Object.entries(personalBestData).slice(4, 8) as entry, index}
			<SingleDataContainer title={entry[0]} data={entry[1]} />
		{/each}
	</BubbleContainer>
</div>

<style>
	#personalBestWrapper {
		display: flex;
		gap: var(--spacing-medium);
	}
</style>
