<script lang="ts">
	import { typingEndModes, typingEndTimeModes, typingEndWordModes, typingModes, userData } from '../../shared/userData.svelte';
</script>

<div id="configWrapper">
	{#each typingModes as typingMode}
		<button
			class:selected={userData.userTypingConfig.typingMode === typingMode}
			onclick={() => {
				userData.userTypingConfig.typingMode = typingMode;
				typingMode === 'smart' ? (userData.userTypingConfig.typingEndMode = 'words') : '';
			}}
		>
			{typingMode}
		</button>
	{/each}

	<div class="separator"></div>

	{#if userData.userTypingConfig.typingMode === 'test'}
		{#each typingEndModes as typingEndMode}
			<button
				class:selected={userData.userTypingConfig.typingEndMode === typingEndMode}
				onclick={() => (userData.userTypingConfig.typingEndMode = typingEndMode)}
			>
				{typingEndMode}
			</button>
		{/each}

		<div class="separator"></div>

		{#if userData.userTypingConfig.typingEndMode === 'words'}
			{#each typingEndWordModes as typingEndWordMode}
				<button
					class:selected={userData.userTypingConfig.typingEndWordMode === typingEndWordMode}
					onclick={() => (userData.userTypingConfig.typingEndWordMode = typingEndWordMode)}
				>
					{typingEndWordMode}
				</button>
			{/each}
		{:else if userData.userTypingConfig.typingEndMode === 'time'}
			{#each typingEndTimeModes as typingEndTimeMode}
				<button
					class:selected={userData.userTypingConfig.typingEndTimeMode === typingEndTimeMode}
					onclick={() => (userData.userTypingConfig.typingEndTimeMode = typingEndTimeMode)}
				>
					{typingEndTimeMode}
				</button>
			{/each}
		{/if}
	{:else if userData.userTypingConfig.typingMode === 'smart'}
		{#each typingEndWordModes as typingEndWordMode}
			<button
				class:selected={userData.userTypingConfig.typingEndWordMode === typingEndWordMode}
				onclick={() => (userData.userTypingConfig.typingEndWordMode = typingEndWordMode)}
			>
				{typingEndWordMode}
			</button>
		{/each}
	{/if}

	<!-- <div class="separator"></div> -->
</div>

<style>
	button {
		font-size: 1rem;
	}

	#configWrapper {
		display: flex;
		flex-direction: row;
		padding: var(--padding-medium);
		border-radius: var(--border-radius);
		background-color: var(--primary-color);
	}
	.separator {
		width: 1px;
		background-color: var(--secondary-color);
	}
</style>
