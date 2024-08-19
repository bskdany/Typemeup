<script lang="ts">
	import type { KeyStatistic } from '@shared/types';
	import { get } from 'svelte/store';
	import { userData } from '../../shared/userData.svelte';

	const { keyStats }: { keyStats: KeyStatistic[] } = $props();

	const row0 = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
	const row1 = ['', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ''];
	const row2 = ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ''];
	const row3 = ['', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ''];
	const row4 = ['', 'Space', ''];
	const rows = [row0, row1, row2, row3, row4];

	function getColor(value: number, min: number, max: number) {
		value = value - min;
		const delta = max - min;
		value = (value / delta) * 100;

		const hexColor = userData.userTypingConfig.colorScheme.accentColor.value;

		const r = parseInt(hexColor.slice(1, 3), 16);
		const g = parseInt(hexColor.slice(3, 5), 16);
		const b = parseInt(hexColor.slice(5, 7), 16);

		// Calculate the adjusted RGB values
		const newR = Math.floor((value * r) / 100);
		const newG = Math.floor((value * g) / 100);
		const newB = Math.floor((value * b) / 100);

		return `rgb(${newR}, ${newG}, ${newB})`;
	}

	function convertKeyToKeyboardFormat(key: string) {
		if (key === ' ') {
			return 'Space';
		} else {
			return key.toUpperCase();
		}
	}

	function buildKeyboardData(keyStatistics: KeyStatistic[]) {
		if (keyStatistics.length === 0) {
			return new Map();
		}
		const keyboardData = new Map<string, { accuracy: number; wpm: number; color: string }>();
		const minScore = Math.min(...keyStatistics.filter((entry) => entry.key !== ' ').map((entry) => entry.score));
		const maxScore = Math.max(...keyStatistics.filter((entry) => entry.key !== ' ').map((entry) => entry.score));

		for (const keyStatistic of keyStatistics) {
			if (keyStatistic.key !== ' ') {
				keyboardData.set(convertKeyToKeyboardFormat(keyStatistic.key), {
					accuracy: Math.round(keyStatistic.accuracy),
					wpm: Math.round(keyStatistic.wpm),
					color: getColor(keyStatistic.score, minScore, maxScore)
				});
			}
		}

		return keyboardData;
	}

	let keyboardData = $derived(buildKeyboardData(keyStats));
	let isKeyboardHovered: boolean = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div id="keyboardWrapper" onmouseover={() => (isKeyboardHovered = true)} onmouseleave={() => (isKeyboardHovered = false)}>
	{#each rows as row, index}
		<div class="row" id="row{index}">
			{#each row as key}
				{#if !isKeyboardHovered}
					<div class="key" class:invisible={key === ''} style="background-color: {keyboardData.get(key)?.color}">
						{key}
					</div>
				{:else}
					<div class="key" class:invisible={key === ''} style="background-color: {keyboardData.get(key)?.color}">
						{keyboardData.get(key) ? keyboardData.get(key).wpm : key}<br />
						{keyboardData.get(key) ? keyboardData.get(key).accuracy + '%' : ''}
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	#keyboardWrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: fit-content;
	}
	.row {
		display: grid;
		width: 100%;
		height: 100%;
	}
	#row0 {
		grid-template-columns: auto repeat(12, 1fr) 2fr;
	}
	#row1 {
		grid-template-columns: 1.5fr repeat(12, 1fr) 1.5fr;
	}
	#row2 {
		grid-template-columns: 2fr repeat(11, 1fr) 2fr;
	}
	#row3 {
		grid-template-columns: 2.5fr repeat(10, 1fr) 2.5fr;
		height: 100%;
	}
	#row4 {
		grid-template-columns: 1fr 2fr 1fr;
	}

	.key {
		font-size: 0.9rem;
		min-width: 40px;
		height: 40px;
		background-color: transparent;
		border: solid;
		border-width: 1px;
		border-radius: 5px;
		border-color: var(--primary-color);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		transition: border-color 0.5s linear;
		transition: background-color 0.5s linear;
		color: var(--text-color);
	}

	.invisible {
		border: none;
		background-color: var(--background-color);
	}
</style>
