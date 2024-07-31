<script lang="ts">
	import PastTypingTestsChart from '../../components/chart/pastTypingTestsChart.svelte';
	import type { PastTypingTestResult } from '../../types/interfaces';
	import PersonalBest from '../../components/profile/personalBest.svelte';
	import ProfileOverview from '../../components/profile/profileOverview.svelte';
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';

	const { data } = $props();
	const pastTypingTestResult: PastTypingTestResult[] = JSON.parse(data.typingData);
</script>

<div id="profileContainer">
	<ProfileOverview />
	<PersonalBest {pastTypingTestResult} />
	<BubbleContainer>
		<PastTypingTestsChart
			data={pastTypingTestResult.map((entry) => {
				return { wpm: entry.wpm, accuracy: entry.accuracy };
			})}
		/>
	</BubbleContainer>
</div>

<style>
	#profileContainer {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
	}
</style>
