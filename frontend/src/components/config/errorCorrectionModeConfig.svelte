<script lang="ts">
	import { userData } from '../../shared/userData.svelte';

	let errorCorrectionModes = {
		0: { name: 'Error block', description: 'Need to remove all incorrect letters before continuing' },
		2: { name: 'Error ignore', description: 'Incorrect letters are ignored from being added' },
		3: { name: 'Spacebar skip', description: 'Spacebar skips the word in case of error' },
		4: { name: 'Smart', description: 'Smart error detection mode (recomended)' }
	};
</script>

<div id="container">
	<div id="title">Error Correction Mode</div>

	<div id="content">
		<div id="description">
			<table>
				<tbody>
					{#each Object.entries(errorCorrectionModes) as [modeNumber, { name, description }]}
						<tr style="display: flex; gap: 8px">
							<th style="white-space: nowrap; display: flex;">{name}:</th>
							<td class:selected={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}>{description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div id="choiceSelection">
			{#each Object.entries(errorCorrectionModes) as [modeNumber, { name, description }]}
				<button
					class:selected={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}
					onclick={() => (userData.userTypingConfig.errorCorrectionMode = parseInt(modeNumber))}>{name}</button
				>
			{/each}
		</div>
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
		width: 100%;
		background-color: transparent;
		border: solid transparent;
		border-radius: var(--border-radius);
		color: var(--text-color);
		padding: calc(var(--padding-medium) + 10) var(--button-padding) calc(var(--padding-medium) + 10) var(--button-padding);
		background-color: var(--primary-color);
	}

	#content {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	#choiceSelection {
		min-width: fit-content;
		height: fit-content;
		margin: var(--spacing-medium);
		border-radius: var(--border-radius);
		background-color: var(--background-color);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	#title {
		opacity: 80%;
		font-size: 1.5rem;
	}

	#description {
		opacity: 60%;
		display: flex;
		flex-direction: row;
	}

	button {
		background-color: var(--background-color);
		padding: calc(var(--padding-medium) + 5px) var(--padding-medium) calc(var(--padding-medium) + 5px) var(--padding-medium);
	}
</style>
