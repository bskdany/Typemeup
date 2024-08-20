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

	function createSlidingWindow<T>(input: T[]): T[][] {
		return input.map((element, index) => {
			return input.slice(0, index + 1);
		});
	}

	function getChartData() {
		const keyPressTimings: number[] = [...typingTestRunData.keyPressTimings];

		// keyPressTimings[0] = keyPressTimings[1]; // because keyPrssTimings[0] is always 0 last thing I want is infinite wpm
		const keyPressErrorStatuses: Letter['errorStatus'][] = [];
		for (const word of typingTestRunData.textObject) {
			for (const letter of word.letters) {
				if (letter.isTyped) {
					keyPressErrorStatuses.push(letter.errorStatus);
				}
			}
		}

		const keyPressTimingsSlidingWindow: number[][] = createSlidingWindow(keyPressTimings);
		const keyPressErrorStatusesSlidingWindow: string[][] = createSlidingWindow(keyPressErrorStatuses);

		const chartKeyPressData: { errorStatus: Letter['errorStatus']; x: number; y: number }[] = [];

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
				const totalChars = keyPressTimingsSlidingWindow[keyPressTimingsCounter].length;
				const correctChars = keyPressErrorStatusesSlidingWindow[index].filter((value) => value === '').length;
				const time = keyPressTimingsSlidingWindow[keyPressTimingsCounter].reduce((sum, val) => sum + val);
				const rawWpm = calculateWpm(totalChars, time);
				const accuracy = correctChars / totalChars;
				const wpm = rawWpm * accuracy;

				yCoordinate = wpm;
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

			chartKeyPressData.push({
				errorStatus: keyPressErrorStatuses[index],
				x: index,
				y: index > 9 ? yCoordinate : getWpm(typingTestRunData)
			});
		}

		const chartWpmData: { x: number; y: number }[] = chartKeyPressData.filter((element, index, arr) => {
			return (index % 10 === 0 && index > 0) || index === arr.length - 1;
		});

		return { chartKeyPressData: chartKeyPressData, chartWpmData: chartWpmData };
	}

	function buildChartData({
		chartKeyPressData,
		chartWpmData
	}: {
		chartKeyPressData: { x: number; y: number; errorStatus: Letter['errorStatus'] }[];
		chartWpmData: { x: number; y: number }[];
	}) {
		const fillerData: { x: number; y: number }[] = [];
		for (let i = 0; i < 10; i++) {
			fillerData.push({ x: i, y: 0 });
		}

		return {
			datasets: [
				{
					label: 'Wrong Keypress',
					type: 'scatter',
					data: chartKeyPressData.filter((point) => point.errorStatus !== '' && point.x > 9),
					pointStyle: 'cross',
					rotation: 45,
					borderColor: 'red',
					radius: 4,
					borderWidth: 2
				},
				{
					label: 'Wpm',
					type: 'line' as any,
					data: chartWpmData,
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
					data: chartKeyPressData.filter((point) => point.errorStatus === '' && point.x > 9),
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
	}
</style>
