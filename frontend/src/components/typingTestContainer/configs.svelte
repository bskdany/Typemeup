<script lang="ts">
	import { getContext } from 'svelte';
	import type { TypingContext, TypingContextData } from '../../interfaces';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	const typingModes: ('time' | 'words')[] = ['time', 'words'];

	const numberOfWords = [10, 25, 50, 100];
	const timeAmount = [15, 30, 60, 120];
</script>

<div id="configWrapper">
	{#each typingModes as mode}
		<button class={typingContextData.configTypingMode === mode ? 'selected' : ''} onclick={() => (typingContextData.configTypingMode = mode)}>
			{mode}
		</button>
	{/each}

	<div id="separator"></div>

	{#if typingContextData.configTypingMode === 'words'}
		{#each numberOfWords as words}
			<button class={typingContextData.configWordAmount === words ? 'selected' : ''} onclick={() => (typingContextData.configWordAmount = words)}>
				{words}
			</button>
		{/each}
	{:else if typingContextData.configTypingMode === 'time'}
		{#each timeAmount as time}
			<button class={typingContextData.configTimeAmount === time ? 'selected' : ''} onclick={() => (typingContextData.configTimeAmount = time)}>
				{time}
			</button>
		{/each}
	{/if}
</div>

<style>
	button {
		color: rgb(127, 106, 106);
		font-size: 1rem;
		border: none;
		background-color: transparent;
	}

	#configWrapper {
		display: flex;
		flex-direction: row;
		padding: 10px;
		/* margin-bottom: 50px; */
		border: solid;
		color: transparent;
		border-radius: 10px;
		background-color: #2c2e31;
		width: min-content;
	}
	#separator {
		width: 2px;
		background-color: rgb(127, 106, 106);
	}
	.selected {
		color: #a8b9e4;
	}
</style>
