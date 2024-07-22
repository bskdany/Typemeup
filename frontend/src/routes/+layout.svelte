<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);

	let displayHome: boolean = $state(false);
	let displayConfig: boolean = $state(false);
	let displayProfile: boolean = $state(false);

	const navigationObject = {
		'/': 'Home',
		'/config': 'Config',
		'/profile': 'Profile'
	};
</script>

<div id="app">
	<header>
		{#each Object.entries(navigationObject) as [path, title]}
			{#if currentPath !== path}
				<button
					onclick={() => {
						goto(path);
					}}
				>
					{title}
				</button>
			{/if}
		{/each}
	</header>

	{@render children()}

	<footer></footer>
</div>

<style>
	#app {
		width: 80%;
		height: 100dvh;
	}

	header {
		display: flex;
		flex-direction: row;
		justify-content: right;
		align-items: center;
		gap: 10px;
		padding: 10px;
	}
</style>
