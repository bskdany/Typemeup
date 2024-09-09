<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import BubbleContainer from '../common/bubbleContainer.svelte';
	import { showToast } from '../../shared/toastController.svelte';
	import { fetchBackend } from '../../lib/fetch';

	let errorCorrectionModes = {
		0: { name: 'Smart', description: 'Smart error detection mode (recomended)' },
		1: { name: 'Error block', description: 'Need to remove all incorrect letters before continuing' },
		2: { name: 'Error ignore', description: 'Incorrect letters are ignored from being added' }
	};

	async function saveConfig() {
		try {
			await fetchBackend(fetch, '/profile/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
			showToast({ message: 'Config saved succesfully', type: 'success' });
		} catch (e) {
			console.error(e);
		}
	}
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
							<td class:selected-text={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}>{description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div id="choiceSelection">
			{#each Object.entries(errorCorrectionModes) as [modeNumber, { name, description }]}
				<button
					class:selected={userData.userTypingConfig.errorCorrectionMode === parseInt(modeNumber)}
					onclick={async () => {
						userData.userTypingConfig.errorCorrectionMode = parseInt(modeNumber);
						await saveConfig();
					}}>{name}</button
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
		font-size: 1.5rem;
	}

	#description {
		display: flex;
		flex-direction: row;
	}

	button {
		padding: calc(var(--padding-medium) + 5px) var(--padding-medium) calc(var(--padding-medium) + 5px) var(--padding-medium);
	}
</style>
