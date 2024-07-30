<script lang="ts">
	import { getContext } from 'svelte';
	import type { TypingContext, TypingContextData } from '../../types/interfaces';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	const typingModes: ('time' | 'words' | 'smart')[] = ['time', 'words', 'smart'];

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
	{:else if typingContextData.configTypingMode === 'smart'}
		{#each numberOfWords as words}
			<button class={typingContextData.configWordAmount === words ? 'selected' : ''} onclick={() => (typingContextData.configWordAmount = words)}>
				{words}
			</button>
		{/each}
	{/if}
</div>

<style>
	button {
		font-size: 1rem;
	}

	#configWrapper {
		display: flex;
		flex-direction: row;
		padding: var(--padding-medium);var(--button-padding);
		border-radius: var(--border-radius);
		background-color: var(--primary-color);
	}
	#separator {
		width: 2px;
		background-color: var(--secondary-color);
	}
</style>
