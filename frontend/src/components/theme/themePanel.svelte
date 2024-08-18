<script lang="ts">
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import { fetchBackend } from '../../lib/fetch';
	import { showToast } from '../../shared/toastController.svelte';
	import { userData } from '../../shared/userData.svelte';

	async function saveConfig() {
		try {
			await fetchBackend(fetch, '/profile/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
			showToast({ message: 'Color scheme saved succesfully', type: 'success' });
		} catch (e) {
			console.error(e);
		}
	}
</script>

<BubbleContainer>
	<div id="theme">
		{#each Object.entries(userData.userTypingConfig.colorScheme) as [key, colorScheme]}
			<div class="color-choser">
				<div style="display: flex; justify-content: center; align-items:center">{colorScheme.name}</div>
				<div class="color-display" style="background-color: {colorScheme.value};">
					<input type="color" bind:value={userData.userTypingConfig.colorScheme[key].value} />
				</div>
			</div>
		{/each}
	</div>

	<button
		onclick={async () => {
			await saveConfig();
		}}>Save</button
	>
</BubbleContainer>

<style>
	#theme {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
		color: var(--text-color);
		height: min-content;
	}

	.color-choser {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: var(--spacing-medium);
	}

	.color-display {
		border-radius: var(--border-radius);
		border: 1px solid white;
	}

	input {
		opacity: 0%;
	}
</style>
