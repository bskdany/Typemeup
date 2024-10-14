<script lang="ts">
	import ErrorCorrectionModeConfig from '../../components/config/errorCorrectionModeConfig.svelte';
	import VisualConfig from '../../components/config/visualConfig.svelte';
</script>

<div id="config">
	<ErrorCorrectionModeConfig />
	<VisualConfig />
</div>

<style>
	#config {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-medium);
		grid-auto-rows: 1fr;
	}

	@media only screen and (max-width: 768px) {
		#config {
			grid-template-columns: 1fr;
			grid-auto-rows: 1fr;
		}
	}
</style>
