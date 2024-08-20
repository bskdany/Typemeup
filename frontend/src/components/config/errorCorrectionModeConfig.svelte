<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import BubbleContainer from '../common/bubbleContainer.svelte';

	let errorCorrectionModes = {
		0: { name: 'Error block', description: 'Need to remove all incorrect letters before continuing' },
		1: { name: 'Error ignore', description: 'Incorrect letters are ignored from being added' },
		2: { name: 'Spacebar skip', description: 'Spacebar skips the word in case of error' },
		3: { name: 'Smart', description: 'Smart error detection mode (recomended)' }
	};
</script>

<BubbleContainer>
	<div id="content">
		<div id="title">Error Correction Mode</div>
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
</BubbleContainer>

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
		padding: calc(var(--padding-medium) + 5px) var(--padding-medium) calc(var(--padding-medium) + 5px) var(--padding-medium);
	}
</style>
