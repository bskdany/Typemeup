<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userData } from '../shared/userData.svelte';
	import { fetchBackend } from '$lib/fetch';
	import { showToast, toastList } from '../shared/toastController.svelte';
	import Toast from '../components/common/toast.svelte';

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

	async function saveConfig() {
		try {
			await fetchBackend(fetch, '/config/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
			showToast({ message: 'Config saved succesfully', type: 'success' });
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div id="app">
	<div id="toastContainer">
		{#each toastList as toast}
			<Toast type={toast.type} message={toast.message} duration={toast.duration} />
		{/each}
	</div>

	<header>
		<button onclick={() => saveConfig()} style={currentPath !== '/config' ? 'visibility:hidden' : ''}> Save </button>
		<div id="globalNavigation">
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
		</div>
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
		justify-content: space-between;
		margin: var(--spacing-medium) 0 var(--spacing-medium) 0;
	}

	#globalNavigation {
		display: flex;
		flex-direction: row;
		justify-content: right;
		align-items: center;
		gap: var(--spacing-medium);
	}

	#toastContainer {
		position: absolute;
		position: absolute;
		/* top: var(--spacing-medium); */
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--spacing-medium);
		flex-direction: column;
	}
</style>
