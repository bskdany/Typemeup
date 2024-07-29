<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userData } from '../globalUserData.svelte';

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);

	let displayHome: boolean = $state(false);
	let displayConfig: boolean = $state(false);
	let displayProfile: boolean = $state(false);

	const navigationObject = $derived({
		'/': 'Home',
		'/config': 'Config',
		'/profile': `Profile ${userData.username}`
	});
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
