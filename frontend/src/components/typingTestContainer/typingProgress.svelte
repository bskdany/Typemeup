<script lang="ts">
	import type { TypingContext, TypingContextData } from '../../interfaces';
	import { getContext } from 'svelte';

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
		color: #a8b9e4;
		font-size: 1.5rem;
	}
</style>
