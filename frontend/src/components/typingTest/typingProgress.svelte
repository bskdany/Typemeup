<script lang="ts">
	import { getContext } from 'svelte';
	import type { TypingContext, TypingContextData } from '../../types/interfaces';
	import { userData } from '../../shared/userData.svelte';

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;
</script>

{#if userData.userTypingConfig.typingEndMode === 'time'}
	<div>{userData.userTypingConfig.typingEndTimeMode - typingContextData.progressTimeElapsed}</div>
{:else if userData.userTypingConfig.typingEndMode === 'words'}
	<div>{typingContextData.progressWordsTyped}|{userData.userTypingConfig.typingEndWordMode}</div>
{/if}

<style>
	div {
		color: var(--accent-color);
		font-size: 1.5rem;
	}
</style>
