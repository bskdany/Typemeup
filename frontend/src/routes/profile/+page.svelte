<script lang="ts">
	import ProfileOverview from '../../components/profile/profileOverview.svelte';
	import PastTypingTestsChart from '../../components/chart/pastTypingTestsChart.svelte';
	import type { PastTypingTestResult } from '../../types/interfaces';

	const { data } = $props();
	const pastTypingTestResult: PastTypingTestResult[] = JSON.parse(data.typingData);
</script>

<ProfileOverview {pastTypingTestResult} />
<div id="chartContainer">
	<PastTypingTestsChart
		data={pastTypingTestResult.map((entry) => {
			return { wpm: entry.wpm, accuracy: entry.accuracy };
		})}
	/>
</div>

<style>
	#chartContainer {
		width: 100%;
		height: 200px;
	}
</style>
