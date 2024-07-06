<script lang="ts">
	import { Title } from 'chart.js';
	import type { TypingTestRunData } from '../../../interfaces';
	import TypingSpeedChart from '../../chart/typingSpeedChart.svelte';
	import SingleDataContainer from '../../common/singleDataContainer.svelte';
	import TextContainer from '../../common/textContainer.svelte';
	import { getAccuracy, getRawWpm, getTime, getWpm } from '../../typingTestRunHelper';

	let pressTabToRestartElement: any;

	const { typingTestRunData, restart }: { typingTestRunData: TypingTestRunData; restart: () => void } = $props();
</script>

<div id="typingResult">
	<div id="topHalf">
		<div id="dataColumn">
			<SingleDataContainer title={'wpm'} data={getWpm(typingTestRunData)} />
			<SingleDataContainer title={'raw'} data={getRawWpm(typingTestRunData)} />
			<SingleDataContainer title={'accuracy'} data={getAccuracy(typingTestRunData) + '%'} />
			<SingleDataContainer title={'time'} data={getTime(typingTestRunData) + ' sec'} />
		</div>
		<div id="chartWrapper">
			<TypingSpeedChart {typingTestRunData} />
		</div>
	</div>

	<div id="bottomHalf">
		<div id="desktop-view">
			<TextContainer input={'Press Tab to restart'} />
		</div>
		<button id="restartButton" onclick={restart}>Restart</button>
	</div>
</div>

<style>
	#topHalf {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	#bottomHalf {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
	}

	#dataColumn {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	#chartWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	#restartButton {
		display: none;
		color: rgb(127, 106, 106);
		font-size: 1rem;
		border: none;
		background-color: #2c2e31;
		padding: 10px;
		border: solid 1px transparent;
		border-radius: 10px;
		margin-top: 30px;
	}
	#restartButton:hover {
		color: #a8b9e4;
	}

	@media only screen and (max-width: 767px) {
		#desktop-view {
			display: none;
		}
		#restartButton {
			display: block;
		}
	}
</style>
