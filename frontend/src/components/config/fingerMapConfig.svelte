<script lang="ts">
	import { reverseFingerMap } from '../../algo/utils';
	import { userData } from '../../shared/userData.svelte';

	let pressedKey: string = $state('');
	const row0 = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
	const row1 = ['', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ''];
	const row2 = ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ''];
	const row3 = ['', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ''];
	const row4 = ['', ' ', ''];
	const rows = [row0, row1, row2, row3, row4];

	const fingerArr = [
		{ id: 0, name: 'Pinkie-L', color: 'tomato' },
		{ id: 1, name: 'Ring-L', color: 'orange' },
		{ id: 2, name: 'Middle-L', color: 'yellow' },
		{ id: 3, name: 'Index-L', color: 'limeGreen' },
		{ id: 4, name: 'Index-R', color: 'deepSkyBlue' },
		{ id: 5, name: 'Middle-R', color: 'pink' },
		{ id: 6, name: 'Ring-R', color: 'violet' },
		{ id: 7, name: 'Pinkie-R', color: 'darkBlue' },
		{ id: 8, name: 'Thumb-L', color: 'turquoise' },
		{ id: 9, name: 'Thumb-R', color: 'salmon' }
	];
	const fingersLeftHand = fingerArr.slice(0, 4);
	const fingersRightHand = fingerArr.slice(4, 8);
	const thumbs = fingerArr.slice(8, 10);

	let reversedFingerMap = $derived(reverseFingerMap(userData.userTypingConfig.smartModeConfig.fingerMap));

	let selectedFinger: number = $state(-1);

	function handleKeySelection(key: string) {
		const currentFinger = reversedFingerMap.get(key);
		if (currentFinger !== undefined && selectedFinger >= 0 && !userData.userTypingConfig.smartModeConfig.fingerMap[selectedFinger]?.includes(key)) {
			userData.userTypingConfig.smartModeConfig.fingerMap[currentFinger] = userData.userTypingConfig.smartModeConfig.fingerMap[currentFinger].filter(
				(value) => value !== key
			);
			userData.userTypingConfig.smartModeConfig.fingerMap[selectedFinger].push(key);
		}
	}

	function handleDoubleKeySelection(key: string) {
		const currentFinger = reversedFingerMap.get(key);
		if (currentFinger !== undefined && selectedFinger === currentFinger) {
			userData.userTypingConfig.smartModeConfig.defaultFingersPosition[selectedFinger] = key;
		}
	}
</script>

<div id="container">
	<div id="title">Finger Map</div>

	<!-- <div id="presetBar">
		<div>
			<button class:selected={selectedMode === 'qwerty'} onclick={() => ((userConfig.fingerMap = [...qwertyFingerMap]), (selectedMode = 'qwerty'))}
				>Qwerty</button
			>
			<button class:selected={selectedMode === 'custom'} onclick={() => ((userConfig.fingerMap = [...customFingerMap]), (selectedMode = 'custom'))}
				>Custom</button
			>
		</div>
		<div>
			<button>New</button>
			<button>Save</button>
			<button onclick={discardChanges}>Discard</button>
		</div>
	</div> -->

	<div id="content">
		<div id="keyboardWrapper">
			{#each rows as row, index}
				<div class="row" id="row{index}">
					{#each row as key}
						{#if reversedFingerMap.get(key.toLowerCase()) !== undefined}
							<button
								onclick={() => handleKeySelection(key.toLowerCase())}
								ondblclick={() => handleDoubleKeySelection(key.toLowerCase())}
								class="key"
								style="background-color: {fingerArr[reversedFingerMap.get(key.toLowerCase()) ?? 0].color};
                opacity: {userData.userTypingConfig.smartModeConfig.defaultFingersPosition.indexOf(key.toLowerCase()) >= 0 ? '100%' : '60%'}"
							>
								{key}
							</button>
						{:else}
							<div class="key">
								{key}
							</div>
						{/if}
					{/each}
				</div>
			{/each}
		</div>

		<div id="fingerSelector">
			<div style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
				<div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 5px">
					{#each fingersLeftHand as { id, name, color }}
						<button onclick={() => (selectedFinger = id)} class="fingerButton" class:selected={selectedFinger === id} style="background-color: {color};"
							>{name}</button
						>
					{/each}
				</div>
				<div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 5px;">
					{#each fingersRightHand as { id, name, color }}
						<button onclick={() => (selectedFinger = id)} class="fingerButton" class:selected={selectedFinger === id} style="background-color: {color};"
							>{name}</button
						>
					{/each}
				</div>
			</div>
			<div style="display: flex; flex-direction: row; width: 100%; justify-content: center; gap: 5px">
				{#each thumbs as { id, name, color }}
					<button onclick={() => (selectedFinger = id)} class="fingerButton" class:selected={selectedFinger === id} style="background-color: {color};"
						>{name}</button
					>
				{/each}
			</div>
		</div>
	</div>

	<div id="instructions">
		<h3>How to use</h3>
		<p>
			Select the finger you want to configure, then select each key it presses.<br />
			Double click a key to mark it as the default resting position of the finger.
		</p>
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
		width: 100%;
		border-radius: var(--border-radius);
		padding: var(--padding-medium);
		color: var(--text-color);
		background-color: var(--primary-color);
	}

	#content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
	}

	#title {
		font-size: 1.5em;
	}

	#fingerSelector {
		display: flex;
		flex-direction: row;
		gap: 5px;
		flex-wrap: wrap;
	}

	.fingerButton {
		width: fit-content;
		height: fit-content;
		min-width: 100px;
	}

	#presetBar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	#keyboardWrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: fit-content;
		width: fit-content;
		margin: auto;
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
		color: var(--secondary-color);
		background-color: var(--background-color);
		width: auto;
		min-width: 40px;
		height: 40px;
		border: solid;
		border-width: 1px;
		border-radius: 5px;
		border-color: var(--primary-color);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.fingerButton:hover {
		color: black;
	}

	.fingerButton.selected {
		color: black;
	}
</style>
