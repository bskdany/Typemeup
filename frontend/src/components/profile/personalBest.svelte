<script lang="ts">
	import { allTypingEndModes } from '../../shared/userData.svelte';

	import type { PastTypingTestResult } from '../../types/interfaces';
	import BubbleContainer from '../common/bubbleContainer.svelte';
	import SingleDataContainer from '../common/singleDataContainer.svelte';

	const { pastTypingTestResult }: { pastTypingTestResult: PastTypingTestResult[] } = $props();

	const personalBestData: { [key: string]: number } = {};
	allTypingEndModes.forEach((typingEndMode) => {
		personalBestData[typingEndMode] = 0;
	});

	for (const typingResult of pastTypingTestResult) {
		let typingEndMode = typingResult.typingEndMode as keyof typeof personalBestData;
		if (typingResult.wpm >= personalBestData[typingEndMode]) {
			personalBestData[typingEndMode] = typingResult.wpm;
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
