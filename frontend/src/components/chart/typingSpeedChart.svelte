<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { TypingTestRunData } from '../../interfaces';
	import { calculateWpm } from '../typingTestRunHelper';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	typingTestRunData.keyPressTimings.forEach((msTime, index) => {
		// basically a sliding window of the last 5 msTime readings, including the current one
		const pastData = typingTestRunData.keyPressTimings.slice(Math.max(index - 4, 0), index + 1);
		console.log(pastData);
	});

	let chartValues = typingTestRunData.keyPressTimings.map((msTime, index) => {
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
			options: {
				maintainAspectRatio: false
			}
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
		height: 100%;
	}
</style>
