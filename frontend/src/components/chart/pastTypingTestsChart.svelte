<script lang="ts">
	import { Chart, ScatterController } from 'chart.js';
	import { onMount } from 'svelte';
	import Dropdown from '../common/dropdown.svelte';
	import { allTypingEndModes, getCombinedTypingEndMode, userData } from '../../shared/userData.svelte';
	// import { allTypingEndMode, typingEndModes, userData } from '../../shared/userData.svelte';

	type PastTypingTestData = {
		wpm: number;
		accuracy: number;
		typingEndMode: string;
	};

	const { data }: { data: PastTypingTestData[] } = $props();
	let previousFilterMode: string = ''; // this variable is needed to prevent the chart from being re-generated when the same filter is selected consecutively

	function calculateEMA(data: number[], period: number): number[] {
		if (data.length < 2) {
			return [];
		}

		const smoothingFactor = 2 / (period + 1);
		const ema: number[] = [data[0]]; // Initialize EMA with the first data point

		for (let i = 1; i < data.length; i++) {
			const currentEMA = (data[i] - ema[i - 1]) * smoothingFactor + ema[i - 1];
			ema.push(currentEMA);
		}

		return ema;
	}

	function buildChartData(data: PastTypingTestData[]) {
		const wpmEma = calculateEMA(
			data.map((entry) => entry.wpm),
			10
		);

		return {
			datasets: [
				{
					label: 'Wpm',
					type: 'scatter' as any,
					data: data.map((entry, index) => {
						return { x: index, y: entry.wpm };
					}),
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
					label: 'Wpm Ema',
					type: 'line' as any,
					data: wpmEma.map((entry, index) => {
						return { x: index, y: entry };
					}),
					borderColor: userData.userTypingConfig.theme.colorScheme.accentColor.value,
					backgroundColor: userData.userTypingConfig.theme.colorScheme.accentColor.value,
					borderWidth: 2,
					lineTension: 0.4,
					pointRadius: 1,
					pointBorderWidth: 1,
					hoverRadius: 3,
					hitRadius: 3
				}

				// {
				// 	label: 'Accuracy',
				// 	type: 'line' as any,
				// 	data: data.map((entry, index) => {
				// 		return { x: index, y: entry.accuracy };
				// 	}),
				// 	borderColor: '#a8b9e4',
				// 	backgroundColor: '#a8b9e4',
				// 	borderWidth: 2,
				// 	lineTension: 0.4,
				// 	pointRadius: 1,
				// 	pointBorderWidth: 1,
				// 	hoverRadius: 3,
				// 	hitRadius: 3
				// }
			]
		};
	}

	function generateChart(filteredData: PastTypingTestData[]) {
		if (!chartCanvas) {
			return;
		}

		const ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'line',
			data: buildChartData(filteredData),
			options: {
				plugins: {
					legend: {
						display: true,
						labels: {
							usePointStyle: true
						}
					}
				},
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						position: 'bottom',
						display: false
					}
				}
			}
		});
	}

	let chartCanvas: any;
	let chart: Chart;
	let filteredData: PastTypingTestData[] = data;

	function updateTypingDataModeFilter(filterMode: string) {
		if (filterMode === previousFilterMode) {
			return;
		}

		previousFilterMode = filterMode;
		filteredData = data.filter((data) => data.typingEndMode === filterMode);

		if (chart) {
			chart.destroy();
		}

		generateChart(filteredData);
	}

	onMount(() => {
		updateTypingDataModeFilter(getCombinedTypingEndMode());
	});
</script>

<div id="chart-wrapper">
	<Dropdown options={allTypingEndModes} defaultOption={getCombinedTypingEndMode()} onOptionSelected={(data) => updateTypingDataModeFilter(data)} />
	<div id="chart-container">
		<canvas bind:this={chartCanvas} id="chart"></canvas>
	</div>
</div>

<style>
	#chart-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	#chart-container {
		position: relative;
		width: 90%;
		height: 100%;
	}
</style>
