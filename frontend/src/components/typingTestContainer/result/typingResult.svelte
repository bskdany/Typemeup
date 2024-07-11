<script lang="ts">
	import { Title } from 'chart.js';
	import TypingSpeedChart from '../../chart/typingSpeedChart.svelte';
	import SingleDataContainer from '../../common/singleDataContainer.svelte';
	import TextContainer from '../../common/textContainer.svelte';
	import { getAccuracy, getCorrectCharCount, getRawWpm, getTime, getWpm, getWrongCharCount } from '../../typingTestRunHelper';
	import KeyPressTimingsChart from '../../chart/keyPressTimingsChart.svelte';
	import TypingTestReplay from './typingTestReplay.svelte';
	import TypingTest from '../typingTest.svelte';
	import { setContext } from 'svelte';
	import type { TypingResultContextData, TypingTestRunData } from '../../../types/interfaces';

	let pressTabToRestartElement: any;
	let typingResultContextData: TypingResultContextData = $state({ activeLetterId: -1, typingTestReplayStatus: 'inactive' });

	setContext('typingResultContext', {
		typingResultContextData: typingResultContextData
	});

	const { typingTestRunData, restart }: { typingTestRunData: TypingTestRunData; restart: () => void } = $props();
</script>

<div id="typingResult">
	<div id="topHalf">
		<div id="dataColumn">
			<SingleDataContainer title={'wpm'} data={getWpm(typingTestRunData)} data_rem={1.4} />
			<SingleDataContainer title={'accuracy'} data={getAccuracy(typingTestRunData) + '%'} data_rem={1.4} />
			<SingleDataContainer title={'raw'} data={getRawWpm(typingTestRunData)} />
			<SingleDataContainer title={'time'} data={getTime(typingTestRunData) + ' sec'} />
			<SingleDataContainer
				title={'characters'}
				data={getCorrectCharCount(typingTestRunData) +
					'/' +
					getWrongCharCount(typingTestRunData, 'wrong') +
					'/' +
					getWrongCharCount(typingTestRunData, 'extra') +
					'/' +
					getWrongCharCount(typingTestRunData, 'missed') +
					'/' +
					getWrongCharCount(typingTestRunData, 'swapped')}
			/>
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
