<script lang="ts">
	import { Chart } from 'chart.js';
	import { onMount } from 'svelte';

	type PastTypingTestData = {
		wpm: number;
		accuracy: number;
	};

	const { data }: { data: PastTypingTestData[] } = $props();

	function buildChartData(data: PastTypingTestData[]) {
		const coordinateSplitData = data.map((entry, index) => {
			return { x: index, y: entry.wpm };
		});

		return {
			datasets: [
				{
					label: 'Wpm',
					type: 'line' as any,
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
					label: 'Accuracy',
					type: 'line' as any,
					data: data.map((entry, index) => {
						return { x: index, y: entry.accuracy };
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
			]
		};
	}

	let chartCanvas: any;
	let chart: Chart;
	const chartData = buildChartData(data);

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
