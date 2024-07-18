<script lang="ts">
	import { Chart, PointElement } from 'chart.js';
	import type { Letter, TypingResultContext, TypingResultContextData, TypingTestRunData } from '../../types/interfaces';
	import { calculateWpm, getWpm } from '../typingTestRunHelper';
	import { getContext, onMount } from 'svelte';
	import { customHighlightPlugin } from './scatterChartProgressPlugin';

	const { typingTestRunData }: { typingTestRunData: TypingTestRunData } = $props();
	const typingResultContext: TypingResultContext = getContext('typingResultContext');
	const typingResultContextData: TypingResultContextData = typingResultContext.typingResultContextData;

	function createSlidingWindow<T>(input: T[], length: number): T[][] {
		return input.map((element, index) => {
			return input.slice(Math.max(index - (length - 1), 0), index + 1);
		});
	}

	function getChartDataPoints() {
		const keyPressTimings: number[] = [...typingTestRunData.keyPressTimings];

		// workaround to avoid very high wpm at the beginning while avoiding completely removing the types chars
		// let keyPressTimingsFiller = 0;
		// for (let counter = 4; counter > 0; counter--) {
		// 	if (keyPressTimingsFiller > 0) {
		// 		keyPressTimings[counter] = keyPressTimingsFiller;
		// 	} else if (keyPressTimings[counter]) {
		// 		keyPressTimingsFiller = keyPressTimings[counter];
		// 	}
		// }

		keyPressTimings[0] = keyPressTimings[1]; // because keyPrssTimings[0] is always 0 last thing I want is infinite wpm
		const keyPressErrorStatuses: Letter['errorStatus'][] = [];
		for (const word of typingTestRunData.textObject) {
			for (const letter of word.letters) {
				if (letter.isTyped) {
					keyPressErrorStatuses.push(letter.errorStatus);
				}
			}
		}

		const keyPressTimingsSlidingWindow: number[][] = createSlidingWindow(keyPressTimings, 5);
		const keyPressErrorStatusesSlidingWindow: string[][] = createSlidingWindow(keyPressErrorStatuses, 5);

		const chartDataPoints: { errorStatus: Letter['errorStatus']; x: number; y: number }[] = [];

		let keyPressTimingsCounter = 0;
		for (let index = 0; index < keyPressErrorStatuses.length; index++) {
			// the hard part is aligning the two data sources into 1

			let yCoordinate: number;
			if (keyPressErrorStatuses[index] === 'extra') {
				// merging 2 keypresses into 1 point, which means I need the wpm for both of them averaged
				// with an extra key pressed, there is one more data point on the keyPressTimings

				const totalCharsPoint1 = keyPressTimingsSlidingWindow[keyPressTimingsCounter].length;
				const correctCharsPoint1 = keyPressErrorStatusesSlidingWindow[index].filter((value) => value === '').length;
				const timePoint1 = keyPressTimingsSlidingWindow[keyPressTimingsCounter].reduce((sum, val) => sum + val);
				const rawWpmPoint1 = calculateWpm(totalCharsPoint1, timePoint1);
				const accuracyPoint1 = correctCharsPoint1 / totalCharsPoint1;
				const wpmPoint1 = rawWpmPoint1 * accuracyPoint1;

				keyPressTimingsCounter += 1;

				const totalCharsPoint2 = keyPressTimingsSlidingWindow[keyPressTimingsCounter].length;
				const correctCharsPoint2 = keyPressErrorStatusesSlidingWindow[index].filter((value) => value === '').length;
				const timePoint2 = keyPressTimingsSlidingWindow[keyPressTimingsCounter].reduce((sum, val) => sum + val);
				const rawWpmPoint2 = calculateWpm(totalCharsPoint2, timePoint2);
				const accuracyPoint2 = correctCharsPoint2 / totalCharsPoint2;
				const wpmPoint2 = rawWpmPoint2 * accuracyPoint2;

				keyPressTimingsCounter += 1;

				const averageWpm = Math.floor((wpmPoint1 + wpmPoint2) / 2);
				yCoordinate = averageWpm;
			} else if (keyPressErrorStatuses[index] === 'missed') {
				// empty spacing
				yCoordinate = 0;
			} else {
				const totalChars = keyPressTimingsSlidingWindow[keyPressTimingsCounter].length;
				const correctChars = keyPressErrorStatusesSlidingWindow[index].filter((value) => value === '').length;
				const time = keyPressTimingsSlidingWindow[keyPressTimingsCounter].reduce((sum, val) => sum + val);
				const rawWpm = calculateWpm(totalChars, time);
				const accuracy = correctChars / totalChars;
				const wpm = rawWpm * accuracy;

				keyPressTimingsCounter += 1;

				yCoordinate = wpm;
			}

			chartDataPoints.push({
				errorStatus: keyPressErrorStatuses[index],
				x: index,
				y: index > 4 ? yCoordinate : getWpm(typingTestRunData)
			});
		}

		return chartDataPoints;
	}

	function buildChartData(chartDataPoints: { x: number; y: number; errorStatus: Letter['errorStatus'] }[]) {
		return {
			datasets: [
				{
					label: 'Correct KeyPresses',
					data: chartDataPoints.filter((point) => point.errorStatus === ''),
					backgroundColor: 'rgb(127, 106, 106)'
				},
				{
					label: 'Missed',
					data: chartDataPoints.filter((point) => point.errorStatus === 'missed'),
					backgroundColor: 'transparent'
				},
				{
					label: 'Wrong',
					data: chartDataPoints.filter((point) => point.errorStatus === 'wrong'),
					backgroundColor: 'red'
				},
				{
					label: 'Extra',
					data: chartDataPoints.filter((point) => point.errorStatus === 'extra'),
					backgroundColor: 'red',
					pointBackgroundColor: 'red',
					pointStyle: 'dash',
					pointRadius: 15,
					borderWidth: 4,
					borderColor: 'red'
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
	}
</style>
