<script lang="ts">
	import { Title } from 'chart.js';
	import { setContext } from 'svelte';
	import { getWpm, getAccuracy, getRawWpm, getTime, getWrongCharCount } from '../../../../lib/typingTestRunHelper';
	import type { TypingResultContextData, TypingTestRunData } from '../../../../types/interfaces';
	import KeyPressTimingsChart from '../../../chart/keyPressTimingsChart.svelte';
	import SingleDataContainer from '../../../common/singleDataContainer.svelte';
	import TypingTestReplay from './typingTestReplay.svelte';

	let typingResultContextData: TypingResultContextData = $state({ activeLetterId: -1, typingTestReplayStatus: 'inactive' });

	setContext('typingResultContext', {
		typingResultContextData: typingResultContextData
	});

	const { typingTestRunData, restart }: { typingTestRunData: TypingTestRunData; restart: () => void } = $props();
</script>

<div id="typingResult" class="bubble">
	<div style="display: flex; gap: var(--spacing-medium); width: 100%;">
		<div style="display: grid; grid-template-rows: 1fr 1fr; gap: var(--spacing-medium);">
			<SingleDataContainer title={'wpm'} data={getWpm(typingTestRunData)} data_rem={2.5} />
			<SingleDataContainer title={'accuracy'} data={getAccuracy(typingTestRunData) + '%'} data_rem={2.5} />
		</div>

		<div style="min-height: 100%; width: 100%;">
			<KeyPressTimingsChart {typingTestRunData} />
		</div>

		<div style="display: flex; flex-direction: column; gap: var(--spacing-medium);">
			<SingleDataContainer title={'raw'} data={getRawWpm(typingTestRunData)} />
			<SingleDataContainer title={'time'} data={getTime(typingTestRunData) + ' sec'} />
			<SingleDataContainer
				title={'characters'}
				data={typingTestRunData.correctKeyPresses +
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
	</div>

	<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--spacing-medium);"></div>

	<button id="restartButton" onclick={restart}>Restart (or press tab!)</button>

	<div style="width: 80%;">
		<TypingTestReplay
			targetText={typingTestRunData.targetText}
			userTypedText={typingTestRunData.userTypedText}
			typingTestKeypressTimings={typingTestRunData.keyPressTimings}
			errorCorrectionMode={typingTestRunData.errorCorrectionMode}
		/>
	</div>
</div>

<style>
	#typingResult {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-medium);
		width: auto;
		height: fit-content;
	}

	#restartButton {
		font-size: 1rem;
	}
</style>
