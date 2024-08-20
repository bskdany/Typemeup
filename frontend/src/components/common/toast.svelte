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
		padding: var(--padding-medium);
		border-radius: var(--border-radius);
		color: var(--text-color);
		background-color: var(--secondary-color);
		z-index: 1000;
	}
	.success {
		border: 1px solid #4caf50;
	}
	.error {
		border: 1px solid #f44336;
	}
	.info {
		border: 1px solid #2196f3;
	}
</style>
