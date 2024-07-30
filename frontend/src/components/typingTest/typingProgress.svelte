<script lang="ts">
	import { getContext } from 'svelte';
	import type { TypingContext, TypingContextData } from '../../types/interfaces';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;
</script>

{#if typingContextData.configTypingMode === 'time'}
	<div>{typingContextData.configTimeAmount - typingContextData.progressTimeElapsed}</div>
{:else if typingContextData.configTypingMode === 'words' || typingContextData.configTypingMode === 'smart'}
	<div>{typingContextData.progressWordsTyped}|{typingContextData.configWordAmount}</div>
{/if}

<style>
	div {
		color: var(--accent-color);
		font-size: 1.5rem;
	}
</style>
