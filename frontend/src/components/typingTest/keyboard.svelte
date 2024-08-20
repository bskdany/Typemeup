<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { TextObject, TypingContextData, TypingContext } from '../../types/interfaces';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	let pressedKey: string = $state('');
	const row0 = [' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
	const row1 = [' ', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', ' '];
	const row2 = [' ', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", ' '];
	const row3 = [' ', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', ' '];
	const row4 = [' ', 'Space', ' '];
	const rows = [row0, row1, row2, row3, row4];

	let timeout: any = null;

	$effect(() => {
		typingContextData.livePressedKey.key === ' ' ? (pressedKey = 'Space') : (pressedKey = typingContextData.livePressedKey.key);
		typingContextData.livePressedKey.count;

		if (timeout != null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			pressedKey = '';
		}, 1000);
	});
</script>

<div id="keyboardWrapper">
	{#each rows as row, index}
		<div class="row" id="row{index}">
			{#each row as key}
				<div class=" {pressedKey.toLowerCase() === key.toLowerCase() ? 'activeKey' : 'key'} {key === ' ' ? 'invisible' : ''}" id="${key}">
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
		font-size: 0.9rem;
		width: auto;
		min-width: 40px;
		height: 40px;
		background-color: transparent;
		border: 1px solid var(--secondary-color);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: border-color 0.5s linear;
		transition: background-color 0.5s linear;
		color: var(--text-color);
	}
	.activeKey {
		font-size: 0.9rem;
		width: auto;
		min-width: 40px;
		height: 40px;
		border: 1px solid var(--secondary-color);
		background-color: var(--secondary-color);
		border-radius: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--text-color);
	}

	.invisible {
		border: none;
	}
</style>
