<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { TypingTestRunData } from '../../interfaces';
	import { calculateWpm } from '../typingTestRunHelper';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	const keyPressTimings: number[] = [...typingTestRunData.keyPressTimings];
	keyPressTimings.shift();

	// arr that tells if the keypress was corect or not
	const keyPressCorrectness: boolean[] = [];
	for (const word of typingTestRunData.textObject) {
		for (const letter of word.letters) {
			keyPressCorrectness.push(letter.isCorrect);
		}
	}
	keyPressCorrectness.shift(); // because the first key pressed doesn't count basically

	// basically a sliding window of the last 5 msTime readings, including the current one
	const keyPressTimingsSlidingWindow: number[][] = [];
	keyPressTimings.forEach((msTime, index) => {
		keyPressTimingsSlidingWindow.push(keyPressTimings.slice(Math.max(index - 4, 0), index + 1));
	});

	const keyPressCorrectnessSlidingWindow: boolean[][] = [];
	keyPressCorrectness.forEach((value, index) => {
		keyPressCorrectnessSlidingWindow.push(keyPressCorrectness.slice(Math.max(index - 4, 0), index + 1));
	});

	const chartPointsValues = keyPressTimings.map((msTime, index) => {
		return {
			isCorrect: keyPressCorrectnessSlidingWindow[index][keyPressCorrectnessSlidingWindow[index].length - 1],
			x: index,
			// x: keyPressTimings.slice(0, index + 1).reduce((sum, val) => sum + val) / 1000,
			y: calculateWpm(
				keyPressTimingsSlidingWindow[index].length - keyPressCorrectnessSlidingWindow[index].filter((value) => value === false).length,
				keyPressTimingsSlidingWindow[index].reduce((sum, val) => sum + val)
			)
		};
	});

	const chartData = {
		datasets: [
			{
				label: 'Correct KeyPresses',
				data: chartPointsValues.filter((point) => point.isCorrect),
				backgroundColor: 'rgb(255, 99, 132)'
			},
			{
				label: 'Wrong KeyPresses',
				data: chartPointsValues.filter((point) => !point.isCorrect),
				backgroundColor: 'rgb(255, 0, 10)'
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
				maintainAspectRatio: false,
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
		width: 90%;
		height: 100%;
	}
</style>
