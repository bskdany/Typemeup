<script lang="ts">
	import { Chart, ScatterController } from 'chart.js';
	import { onMount } from 'svelte';
	import Dropdown from '../common/dropdown.svelte';
	import { allTypingEndModes, getCombinedTypingEndMode } from '../../shared/userData.svelte';
	// import { allTypingEndMode, typingEndModes, userData } from '../../shared/userData.svelte';

	type PastTypingTestData = {
		wpm: number;
		accuracy: number;
		typingEndMode: string;
	};

	const { data }: { data: PastTypingTestData[] } = $props();

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
					borderColor: '#a8b9e4',
					backgroundColor: '#a8b9e4',
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
					borderColor: '#a8b9e4',
					backgroundColor: '#a8b9e4',
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
							usePointStyle: true,
							color: 'rgb(255, 99, 132)'
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
		filteredData = data.filter((data) => data.typingEndMode === filterMode);

		var chartExist = Chart.getChart('myChart'); // <canvas> id
		if (chart) {
			chart.destroy();
		}

		generateChart(filteredData);
	}

	onMount(() => {
		generateChart(filteredData);
	});
</script>

<Dropdown options={allTypingEndModes} defaultOption={getCombinedTypingEndMode()} onOptionSelected={(data) => updateTypingDataModeFilter(data)} />
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
