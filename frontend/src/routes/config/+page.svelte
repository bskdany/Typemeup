<script lang="ts">
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import ToggleOption from '../../components/common/toggleOption.svelte';
	import ErrorCorrectionModeConfig from '../../components/config/errorCorrectionModeConfig.svelte';
	import { userData } from '../../shared/userData.svelte';
</script>

<div id="config">
	<ErrorCorrectionModeConfig />
	<BubbleContainer>
		<div id="visualConfig">
			<h3>Visual Config</h3>
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
	</BubbleContainer>
</div>

<style>
	#config {
		display: flex;
		gap: var(--spacing-medium);
	}

	#visualConfig {
		display: flex;
		gap: var(--spacing-medium);
		flex-direction: column;
		margin-bottom: auto;
	}
</style>
