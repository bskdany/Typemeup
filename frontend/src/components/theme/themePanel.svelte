<script lang="ts">
	import type { ColorScheme, UserTypingConfig } from '@shared/types';
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import { fetchBackend } from '../../lib/fetch';
	import { showToast } from '../../shared/toastController.svelte';
	import { isLoggedIn, userData } from '../../shared/userData.svelte';
	import Dropdown from '../common/dropdown.svelte';
	import { themes, defaultUserTypingConfig } from '@shared/defaultData';

	let themeChangeHistory: UserTypingConfig['theme'][] = $state([]);
	themeChangeHistory.push(JSON.parse(JSON.stringify(userData.userTypingConfig.theme)));
	let themeChangeHistoryIndex = 0;

	async function applyPresetTheme(presetName: keyof typeof themes | 'custom') {
		if (presetName === 'custom') {
			userData.userTypingConfig.theme = JSON.parse(JSON.stringify(userData.userTypingConfig.customTheme));
		} else {
			userData.userTypingConfig.theme.name = presetName;
			userData.userTypingConfig.theme.colorScheme = JSON.parse(JSON.stringify(themes[presetName]));
		}

		themeChangeHistory.push(JSON.parse(JSON.stringify(userData.userTypingConfig.theme)));
		themeChangeHistoryIndex += 1;
	}

	async function applyCustomTheme(key: keyof typeof userData.userTypingConfig.customTheme) {
		// if the user applied a custom color then the base theme needs to be pushed to the front
		// of the history, so that when the user switches to the previous theme it's more intuitive
		themeChangeHistory.push(JSON.parse(JSON.stringify(themeChangeHistory.shift())));

		userData.userTypingConfig.theme.name = 'custom';
		userData.userTypingConfig.customTheme.colorScheme[key].value = userData.userTypingConfig.theme.colorScheme[key].value;

		themeChangeHistory.push(JSON.parse(JSON.stringify(userData.userTypingConfig.theme)));
		themeChangeHistoryIndex = themeChangeHistory.length - 1;
	}

	function previousTheme() {
		if (themeChangeHistoryIndex > 0) {
			themeChangeHistoryIndex -= 1;
			userData.userTypingConfig.theme = JSON.parse(JSON.stringify(themeChangeHistory[themeChangeHistoryIndex]));
		}
	}

	function nextTheme() {
		if (themeChangeHistoryIndex < themeChangeHistory.length - 1) {
			themeChangeHistoryIndex += 1;
			userData.userTypingConfig.theme = JSON.parse(JSON.stringify(themeChangeHistory[themeChangeHistoryIndex]));
		}
	}
</script>

<BubbleContainer>
	<div id="themePanelContent">
		<Dropdown
			options={[...Object.keys(themes), 'custom']}
			onOptionSelected={async (theme) => applyPresetTheme(theme)}
			selectedOption={userData.userTypingConfig.theme.name}
		/>
		{#each Object.entries(userData.userTypingConfig.theme.colorScheme) as [key, colorScheme]}
			<div class="color-choser">
				<div style="display: flex; justify-content: center; align-items:center">{colorScheme.name}</div>
				<div class="color-display" style="background-color: {colorScheme.value};">
					<input type="color" bind:value={userData.userTypingConfig.theme.colorScheme[key].value} onchange={async () => applyCustomTheme(key)} />
				</div>
			</div>
		{/each}
		<div id="themeControl">
			<button onclick={previousTheme}>Previous</button>
			<button onclick={nextTheme}>Next</button>
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
