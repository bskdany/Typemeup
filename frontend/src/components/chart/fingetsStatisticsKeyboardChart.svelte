<script lang="ts">
	import type { FingerStatistics } from '../../types/algo';

	const { fingersStatistics }: { fingersStatistics: FingerStatistics[] } = $props();

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

		const red = Math.floor(((100 - value) * 255) / 100);
		const green = Math.floor((value * 255) / 100);
		return `rgb(${red}, ${green}, 0)`;
	}

	function buildKeyboardData(fingersStatistics: FingerStatistics[]) {
		const destinationKeys = new Map<string, number>();

		for (const fingerStatistics of fingersStatistics) {
			for (const keyToKeyMovement of fingerStatistics.keyToKeyMovements) {
				let keyValue = destinationKeys.get(keyToKeyMovement.destinationKey) ?? 0;
				keyValue += keyToKeyMovement.confidence;
				destinationKeys.set(keyToKeyMovement.destinationKey, keyValue);
			}
		}

		let min = Infinity;
		let max = -Infinity;
		for (const value of destinationKeys.values()) {
			if (value < min) {
				min = value;
			}
			if (value > max) {
				max = value;
			}
		}

		const keyColors = new Map<string, string>();
		for (const [key, value] of destinationKeys.entries()) {
			keyColors.set(key, getColor(value, min, max));
		}

		return keyColors;
	}

	const keyboardData = $derived(buildKeyboardData(fingersStatistics));
	$effect(() => {
		console.log(keyboardData);
	});
</script>

<div id="keyboardWrapper">
	{#each rows as row, index}
		<div class="row" id="row{index}">
			{#each row as key}
				<div class="key" class:invisible={key === ''} style="background-color: {keyboardData.get(key.toLowerCase())}">
					{key}
				</div>
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
