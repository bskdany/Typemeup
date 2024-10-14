<script lang="ts">
	import { userData } from '../../shared/userData.svelte';
	import ToggleOption from '../../components/common/toggleOption.svelte';
</script>

<div class="bubble" id="visualConfig">
	<h2>Visual Config</h2>
	<ToggleOption
		title="Show live keypress keyboard"
		defaultValue={userData.userTypingConfig.visualConfig.showLiveKeypressKeyboard}
		onChange={(value) => {
			userData.userTypingConfig.visualConfig.showLiveKeypressKeyboard = value;
		}}
	/>
	<ToggleOption
		title="Show smart mode keyboard"
		defaultValue={userData.userTypingConfig.visualConfig.showSmartModeKeyboard}
		onChange={(value) => {
			userData.userTypingConfig.visualConfig.showSmartModeKeyboard = value;
		}}
	/>
</div>

<style>
	#visualConfig {
		display: flex;
		gap: var(--spacing-medium);
		flex-direction: column;
		padding: var(--spacing-medium);
	}
</style>
