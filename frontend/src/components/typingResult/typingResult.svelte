<script lang="ts">
	import { Title } from 'chart.js';
	import { setContext } from 'svelte';
	import type { TypingResultContextData, TypingTestRunData } from '../../types/interfaces';
	import KeyPressTimingsChart from '../chart/keyPressTimingsChart.svelte';
	import SingleDataContainer from '../common/singleDataContainer.svelte';
	// import TextContainer from '../common/textContainer.svelte';
	import { getWpm, getAccuracy, getRawWpm, getTime, getCorrectCharCount, getWrongCharCount } from '../../lib/typingTestRunHelper';
	import TypingTestReplay from './typingTestReplay.svelte';
	import BubbleContainer from '../common/bubbleContainer.svelte';

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
		<BubbleContainer>"Press tab to restart"</BubbleContainer>
	</div>
	<!-- <button id="restartButton" onclick={restart}>Restart</button> -->
</div>

<style>
	#typingResult {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-medium);
	}

	#topHalf {
		display: flex;
		flex-direction: row;
		gap: var(--spacing-medium);
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
		gap: var(--spacing-medium);
	}

	#restartButton {
		font-size: 1rem;
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
