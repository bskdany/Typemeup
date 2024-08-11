<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userData } from '../shared/userData.svelte';
	import { showToast, toastList } from '../shared/toastController.svelte';
	import Toast from '../components/common/toast.svelte';
	import { fetchBackend } from '../lib/fetch';

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);

	async function saveConfig() {
		try {
			await fetchBackend(fetch, '/profile/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
			showToast({ message: 'Config saved succesfully', type: 'success' });
		} catch (e) {
			console.error(e);
		}
	}

	async function logout() {
		try {
			await fetchBackend(fetch, '/auth/logout', { method: 'POST' });
			userData.username = '';
			goto('/account');
		} catch (e) {
			console.error(e);
		}
	}

	const navigationObject = $derived({
		'/': 'Home',
		'/config': 'Config',
		'/profile': `Profile ${userData.username}`
	});

	const pageHelperButtons: { [path: string]: [string, () => void] } = {
		'/config': ['Save', saveConfig],
		'/profile': ['Logout', logout]
	};
</script>

<div id="app">
	<div id="toastContainer">
		{#each toastList as toast}
			<Toast type={toast.type} message={toast.message} duration={toast.duration} />
		{/each}
	</div>

	<header>
		{#if currentPath in pageHelperButtons}
			<button onclick={() => pageHelperButtons[currentPath][1]()}>
				{pageHelperButtons[currentPath][0]}
			</button>
		{:else}
			<button style="visibility: hidden;"></button>
		{/if}

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
