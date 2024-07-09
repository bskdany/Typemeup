<script lang="ts">
	import { Title } from 'chart.js';
	import type { TypingTestRunData } from '../../../interfaces';
	import TypingSpeedChart from '../../chart/typingSpeedChart.svelte';
	import SingleDataContainer from '../../common/singleDataContainer.svelte';
	import TextContainer from '../../common/textContainer.svelte';
	import { getAccuracy, getRawWpm, getTime, getWpm } from '../../typingTestRunHelper';
	import KeyPressTimingsChart from '../../chart/keyPressTimingsChart.svelte';
	import TypingTestReplay from './typingTestReplay.svelte';

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
		<div id="chartContainer">
			<KeyPressTimingsChart {typingTestRunData} />
		</div>
	</div>

	<div style="width: 60%;">
		<TypingTestReplay
			targetText={typingTestRunData.targetText}
			userTypedText={typingTestRunData.userTypedText}
			typingTestKeypressTimings={typingTestRunData.keyPressTimings}
			errorCorrectionMode={typingTestRunData.errorCorrectionMode}
		/>
	</div>

	<div id="desktop-view">
		<TextContainer input={'Press Tab to restart'} />
	</div>
	<button id="restartButton" onclick={restart}>Restart</button>
</div>

<style>
	#typingResult {
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
		gap: 30px;
	}

	#topHalf {
		display: flex;
		flex-direction: row;
		gap: 20px;
		height: 50%;
		width: 100%;
	}
	#chartContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		min-height: 100%;
	}

	#dataColumn {
		display: flex;
		flex-direction: column;
		gap: 10px;
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
