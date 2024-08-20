<script lang="ts">
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import ErrorCorrectionModeConfig from '../../components/config/errorCorrectionModeConfig.svelte';
</script>

<div id="config">
	<ErrorCorrectionModeConfig />
	<BubbleContainer>
		<div>Work in progress</div>
	</BubbleContainer>
</div>

<style>
	#config {
		display: flex;
		gap: var(--spacing-medium);
	}
</style>
