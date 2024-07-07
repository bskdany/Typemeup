<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { TypingTestRunData } from '../../interfaces';
	import { calculateWpm } from '../typingTestRunHelper';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	const keyPressTimingsSlidingWindow: number[][] = [];
	typingTestRunData.keyPressTimings.forEach((msTime, index) => {
		// basically a sliding window of the last 5 msTime readings, including the current one
		keyPressTimingsSlidingWindow.push(typingTestRunData.keyPressTimings.slice(Math.max(index - 4, 1), index + 1));
	});

	keyPressTimingsSlidingWindow[0] = keyPressTimingsSlidingWindow[1];
	console.log(keyPressTimingsSlidingWindow);

	const chartPointsValues = typingTestRunData.keyPressTimings.map((msTime, index) => {
		return {
			x: typingTestRunData.keyPressTimings.slice(0, index + 1).reduce((sum, val) => sum + val) / 1000,
			y: calculateWpm(
				keyPressTimingsSlidingWindow[index].length,
				keyPressTimingsSlidingWindow[index].reduce((sum, val) => sum + val)
			)
		};
	});

	const chartData = {
		datasets: [
			{
				label: 'Keypress timings',
				data: chartPointsValues,
				backgroundColor: 'rgb(255, 99, 132)'
			}
		]
	};

	console.log(chartData);

	let ctx;
	let chartCanvas: any;

	onMount(() => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, {
			type: 'scatter',
			data: chartData,
			options: {
				scales: {
					x: {
						type: 'linear',
						position: 'bottom'
					}
				}
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
	}
</style>
