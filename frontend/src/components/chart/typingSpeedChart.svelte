<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { TypingTestRunData } from '../../interfaces';
	import { calculateWpm } from '../typingTestRunHelper';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	let chartValues = typingTestRunData.keyPressTimings.map((msTime) => {
		return calculateWpm(1, msTime);
	});

	chartValues[0] = chartValues[1]; // to avoid getting infinite wpn on first letter

	let chartLabels = typingTestRunData.userTypedText;
	let ctx;
	let chartCanvas: any;

	onMount(() => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: chartLabels,
				datasets: [
					{
						label: 'Wpm',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: chartValues
					}
				]
			},
			options: {}
		});
	});
</script>

<div id="chart-container">
	<canvas bind:this={chartCanvas} id="chart"></canvas>
</div>

<style>
	#chart-container {
		position: relative;
		width: 100%;
	}
</style>
