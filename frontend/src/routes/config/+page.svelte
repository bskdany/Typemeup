<script lang="ts">
	import ErrorCorrectionModeConfig from '../../components/config/errorCorrectionModeConfig.svelte';
	import FingerMapConfig from '../../components/config/fingerMapConfig.svelte';
</script>

<div id="config">
	<ErrorCorrectionModeConfig />
	<FingerMapConfig />
</div>

<style>
	#config {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
