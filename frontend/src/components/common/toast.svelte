<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { Toast } from '../../shared/toastController.svelte';

	const { message, duration, type }: Toast = $props();

	let visible = $state(true);

	onMount(() => {
		const timer = setTimeout(() => {
			visible = false;
		}, duration);

		return () => clearTimeout(timer);
	});
</script>

{#if visible}
	<div transition:fade class="toast" class:success={type === 'success'} class:error={type === 'error'} class:info={type === 'info'}>
		{message}
	</div>
{/if}

<style>
	.toast {
		padding: 10px 20px;
		border-radius: 4px;
		color: white;
		font-weight: bold;
		z-index: 1000;
	}
	.success {
		background-color: #4caf50;
	}
	.error {
		background-color: #f44336;
	}
	.info {
		background-color: #2196f3;
	}
</style>
