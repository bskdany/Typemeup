<script lang="ts">
	import { Chart } from 'chart.js';
	import type { TypingTestRunData } from '../../types/interfaces';
	import { calculateWpm } from '../typingTestRunHelper';
	import { onMount } from 'svelte';
	import { customHighlightPlugin } from './scatterChartProgressPlugin';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();

	function getChartDataPoints() {
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

		const chartDataPoints = keyPressTimings.map((msTime, index) => {
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

		return chartDataPoints;
	}

	function buildChartData(chartDataPoints: { x: number; y: number; isCorrect: boolean }[]) {
		return {
			datasets: [
				{
					label: 'Correct KeyPresses',
					data: chartDataPoints.filter((point) => point.isCorrect),
					backgroundColor: 'rgb(255, 99, 132)'
				},
				{
					label: 'Wrong KeyPresses',
					data: chartDataPoints.filter((point) => !point.isCorrect),
					backgroundColor: 'rgb(255, 0, 10)'
				}
			]
		};
	}

	let chartCanvas: any;
	let chart: Chart;
	const chartData = buildChartData(getChartDataPoints());

	function moveActivePointBar(index: number) {
		if (chart.options.plugins?.customHighlight) {
			chart.options.plugins.customHighlight.index = index;
		}
		chart.update();
	}

	function disableActivePointBar() {
		moveActivePointBar(-1);
	}

	onMount(() => {
		const ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'scatter',
			data: chartData,
			options: {
				plugins: {
					customHighlight: {
						index: -1
					}
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						position: 'bottom'
					}
				}
			},
			plugins: [customHighlightPlugin]
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
