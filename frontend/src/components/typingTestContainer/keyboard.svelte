<script lang="ts">
	import { onMount } from 'svelte';
	import { pressedKeyStore } from '../../scripts/stores';

	let pressedKey: string;
	const row0 = [' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
	const row1 = [' ', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ' '];
	const row2 = [' ', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ' '];
	const row3 = [' ', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ' '];
	const row4 = [' ', 'Space', ' '];
	const rows = [row0, row1, row2, row3, row4];

	onMount(() => {
		pressedKeyStore.subscribe((value) => {
			pressedKey = value.value;
			setTimeout(() => {
				pressedKey = '';
			}, 1000);
		});
	});
</script>

<div id="keyboardWrapper">
	{#each rows as row, index}
		<div class="row" id="row{index}">
			{#each row as key}
				<div class=" {pressedKey == key.toLowerCase() ? 'activeKey' : 'key'} {key == ' ' ? 'invisible' : ''}" id="${key}">
					{key}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	#keyboardWrapper {
		/* margin: 50px; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: fit-content;
		/* width: min-content; */
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
		color: rgb(127, 106, 106);
		width: auto;
		/* width: 40px; */
		/* min-width: min-content; */
		height: 40px;
		background-color: transparent;
		border: solid;
		border-width: 2px;
		border-radius: 5px;
		border-color: #2c2e31;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: border-color 0.5s linear;
		transition: background-color 0.5s linear;
	}
	.activeKey {
		color: rgb(127, 106, 106);
		width: auto;
		min-width: 40px;
		height: 40px;
		background-color: #27282a;
		border: solid;
		border-width: 2px;
		border-radius: 5px;
		border-color: #2c2e31;
		/* uncommnet for fun mode */
		/* border-color: gold; */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.invisible {
		border: none;
	}
</style>
