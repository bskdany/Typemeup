<script lang="ts">
	import { userData } from '../../shared/userData.svelte';

	const errorCorrectionModeOptions = [
		{ name: 'Smart', description: 'Smart error detection mode (recomended)' },
		{ name: 'Error block', description: 'Need to remove all incorrect letters before continuing' },
		{ name: 'Error ignore', description: 'Incorrect letters are ignored from being added' }
	];
</script>

<div class="bubble" id="content">
	<h2>Error Correction Mode</h2>

	<div id="description">
		<table>
			<tbody>
				{#each errorCorrectionModeOptions as errorCorrectionMode, index}
					<tr style="display: flex; gap: 8px">
						<th style="white-space: nowrap; display: flex;">{errorCorrectionMode.name}:</th>
						<td class:selected-text={userData.userTypingConfig.errorCorrectionMode === index}>{errorCorrectionMode.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div id="choiceSelection">
		{#each errorCorrectionModeOptions as errorCorrectionMode, index}
			<button
				class:selected={userData.userTypingConfig.errorCorrectionMode === index}
				onclick={() => {
					userData.userTypingConfig.errorCorrectionMode = index;
				}}>{errorCorrectionMode.name}</button
			>
		{/each}
	</div>
</div>

<style>
	#choiceSelection {
		width: fit-content;
		height: fit-content;
		margin: var(--spacing-medium) auto var(--spacing-medium) auto;
		border-radius: var(--border-radius);
		background-color: var(--primary-color);
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	#description {
		display: flex;
		flex-direction: row;
	}

	button {
		padding: calc(var(--padding-medium) + 5px) var(--padding-medium) calc(var(--padding-medium) + 5px) var(--padding-medium);
	}
</style>
