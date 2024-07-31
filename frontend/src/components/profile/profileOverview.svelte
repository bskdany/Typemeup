<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import type { PastTypingTestResult } from '../../types/interfaces';
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

	console.log(pastTypingTestResult);

	for (const typingResult of pastTypingTestResult) {
		let typingMode = typingResult.typingMode as keyof typeof personalBestData;
		if (typingResult.wpm >= personalBestData[typingMode]) {
			personalBestData[typingMode] = typingResult.wpm;
			console.log(typingResult.wpm);
		}
	}

	console.log(Object.entries(personalBestData));
</script>

<div>
	Welcome back {userData.username}
	<div id="personalBestWrapper">
		<div id="personalBestContainer">
			{#each Object.entries(personalBestData).slice(0, 4) as entry, index}
				<SingleDataContainer title={entry[0]} data={entry[1]} />
			{/each}
		</div>

		<div id="personalBestContainer">
			{#each Object.entries(personalBestData).slice(4, 8) as entry, index}
				<SingleDataContainer title={entry[0]} data={entry[1]} />
			{/each}
		</div>
	</div>
</div>

<style>
	#personalBestContainer {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: space-around;
		flex-wrap: wrap;
		background-color: var(--primary-color);
		border-radius: var(--border-radius);
	}

	#personalBestWrapper {
		display: flex;
		width: 100%;
		gap: var(--spacing-large);
		justify-content: space-between;
	}
</style>
