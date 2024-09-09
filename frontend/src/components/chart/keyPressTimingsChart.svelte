<script lang="ts">
	import { Chart } from 'chart.js/auto';
	import type { Letter, TypingResultContext, TypingResultContextData, TypingTestRunData } from '../../types/interfaces';
	import { calculateWpm, getWpm } from '../../lib/typingTestRunHelper';
	import { getContext, onMount } from 'svelte';
	import { customHighlightPlugin } from './scatterChartProgressPlugin';
	import { userData } from '../../shared/userData.svelte';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();
	const typingResultContext: TypingResultContext = getContext('typingResultContext');
	const typingResultContextData: TypingResultContextData = typingResultContext.typingResultContextData;

	function getChartData() {
		const chartData: { x: number; y: number; isCorrect: boolean }[] = [];

		let correctCharCount = 0;
		let firstKeyPressTime = 0;

		for (let keyPressCounter = 0; keyPressCounter < typingTestRunData.keyPressTimings.length; keyPressCounter++) {
			let keyPressTime = typingTestRunData.keyPressTimings[keyPressCounter];
			let isKeyPressCorrect = typingTestRunData.keyPressCorrectness[keyPressCounter];

			if (isKeyPressCorrect) {
				correctCharCount += 1;
			}

			let wpm = 0;
			if (keyPressCounter === 0) {
				firstKeyPressTime = keyPressTime;
			} else if (keyPressCounter >= 10) {
				wpm = calculateWpm(correctCharCount, keyPressTime - firstKeyPressTime);
			}

			chartData.push({
				x: keyPressCounter,
				y: wpm,
				isCorrect: isKeyPressCorrect
			});
		}

		return chartData;
	}

	function buildChartData(chartData: { x: number; y: number; isCorrect: boolean }[]) {
		const fillerData: { x: number; y: number }[] = [];
		for (let i = 0; i < 10; i++) {
			fillerData.push({ x: i, y: 0 });
		}

		return {
			datasets: [
				{
					label: 'Wrong Keypress',
					type: 'scatter',
					data: chartData.filter((point) => point.isCorrect === false && point.x > 9),
					pointStyle: 'cross',
					rotation: 45,
					borderColor: 'red',
					radius: 4,
					borderWidth: 2
				},
				{
					label: 'Wpm',
					type: 'line' as any,
					data: chartData.filter((point) => point.x > 9),
					borderColor: userData.userTypingConfig.theme.colorScheme.accentColor.value,
					backgroundColor: userData.userTypingConfig.theme.colorScheme.accentColor.value,
					borderWidth: 2,
					lineTension: 0.4,
					pointRadius: 1,
					pointBorderWidth: 1,
					hoverRadius: 3,
					hitRadius: 3
				},
				{
					label: 'Correct KeyPresses',
					data: chartData.filter((point) => point.isCorrect === true && point.x > 9),
					backgroundColor: userData.userTypingConfig.theme.colorScheme.textColor.value,
					pointRadius: 0,
					hoverRadius: 0,
					hitRadius: 0
				},
				{
					label: 'Filler',
					data: fillerData,
					backgroundColor: 'transparent',
					hoverRadius: 0
				}
			]
		};
	}

	let chartCanvas: any;
	let chart: Chart;
	const chartData = buildChartData(getChartData());

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
					},
					legend: {
						labels: {
							usePointStyle: true
						}
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

	$effect(() => {
		moveActivePointBar(typingResultContextData.activeLetterId);
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
		margin: auto;
	}
</style>
