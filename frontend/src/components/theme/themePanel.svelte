<script lang="ts">
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import { fetchBackend } from '../../lib/fetch';
	import { showToast } from '../../shared/toastController.svelte';
	import { isLoggedIn, userData } from '../../shared/userData.svelte';
	import Dropdown from '../common/dropdown.svelte';
	import { themes, defaultUserTypingConfig } from '@shared/defaultData';

	let hasColorValueManuallyChanged = $state(false);

	function applyPreset(presetName: keyof typeof themes | 'custom') {
		if (presetName === 'custom') {
			userData.userTypingConfig.theme = JSON.parse(JSON.stringify(userData.userTypingConfig.customTheme));
		} else {
			userData.userTypingConfig.theme.name = presetName;
			userData.userTypingConfig.theme.colorScheme = JSON.parse(JSON.stringify(themes[presetName]));
		}
		hasColorValueManuallyChanged = false;
	}

	async function saveConfig() {
		if (hasColorValueManuallyChanged) {
			userData.userTypingConfig.customTheme = JSON.parse(JSON.stringify(userData.userTypingConfig.theme));
			userData.userTypingConfig.theme.name = 'custom';
		}

		hasColorValueManuallyChanged = false;

		if (isLoggedIn()) {
			try {
				await fetchBackend(fetch, '/profile/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
				showToast({ message: 'Color scheme saved succesfully', type: 'success' });
			} catch (e) {
				console.error(e);
			}
		} else {
			showToast({ message: 'User is not logged in', type: 'error' });
		}
	}
</script>

<BubbleContainer>
	<div id="themePanelContent">
		<Dropdown title="Theme" options={[...Object.keys(themes), 'custom']} onOptionSelected={applyPreset} defaultOption={userData.userTypingConfig.theme.name} />
		{#each Object.entries(userData.userTypingConfig.theme.colorScheme) as [key, colorScheme]}
			<div class="color-choser">
				<div style="display: flex; justify-content: center; align-items:center">{colorScheme.name}</div>
				<div class="color-display" style="background-color: {colorScheme.value};">
					<input
						type="color"
						bind:value={userData.userTypingConfig.theme.colorScheme[key].value}
						onchange={() => {
							hasColorValueManuallyChanged = true;
						}}
					/>
				</div>
			</div>
		{/each}
		<div id="themeControl">
			<button
				disabled={!hasColorValueManuallyChanged}
				style={hasColorValueManuallyChanged ? '' : 'opacity: 0.2'}
				onclick={() => {
					userData.userTypingConfig.theme.colorScheme = JSON.parse(JSON.stringify(defaultUserTypingConfig.theme.colorScheme));
				}}>Reset</button
			>
			<button
				onclick={async () => {
					await saveConfig();
				}}>Save</button
			>
		</div>
	</div>
</BubbleContainer>

<style>
	#themePanelContent {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
		color: var(--text-color);
		justify-content: center;
		align-items: center;
	}

	#themeControl {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-medium);
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
