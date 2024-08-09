<script lang="ts">
	import type { KeyStatistic } from '../../types/algo';

	const { keyStatistics, smartTrainingGoal }: { keyStatistics: Map<string, KeyStatistic>; smartTrainingGoal: 'wpm' | 'accuracy' } = $props();

	let pressedKey: string = $state('');
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

		const blue = Math.floor((value * 200) / 100);
		return `rgb(0, 0, ${55 + blue})`;
	}

	function convertKeyToKeyboardFormat(key: string) {
		if (key === ' ') {
			return 'Space';
		} else {
			return key.toUpperCase();
		}
	}

	function buildKeyboardData(keysStatistics: Map<string, KeyStatistic>) {
		const keyboardData = new Map<string, { accuracy: number; wpm: number; color: string }>();

		let min = Infinity;
		let max = -Infinity;
		for (const keyStatistics of keyboardData.values()) {
			if (keyStatistics[smartTrainingGoal] < min) {
				min = keyStatistics[smartTrainingGoal];
			}
			if (keyStatistics[smartTrainingGoal] > max) {
				max = keyStatistics[smartTrainingGoal];
			}
		}

		for (const keyStatistic of keysStatistics.values()) {
			keyboardData.set(convertKeyToKeyboardFormat(keyStatistic.key), {
				accuracy: keyStatistic.accuracy,
				wpm: keyStatistic.wpm,
				color: getColor(keyStatistic[smartTrainingGoal], min, max)
			});
		}

		return keyboardData;
	}

	const keyboardData = $derived(buildKeyboardData(keyStatistics));
	$effect(() => {
		console.log(keyboardData);
	});

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
						{keyboardData.get(key)?.[smartTrainingGoal].toFixed(1) ?? key}
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
		width: auto;
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
		transition: border-color 0.5s linear;
		transition: background-color 0.5s linear;
	}

	.invisible {
		border: none;
		background-color: var(--background-color);
	}
</style>
