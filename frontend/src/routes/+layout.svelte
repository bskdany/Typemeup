<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userData } from '../shared/userData.svelte';
	import { showToast, toastList } from '../shared/toastController.svelte';
	import Toast from '../components/common/toast.svelte';
	import { fetchBackend } from '../lib/fetch';
	import ThemePanel from '../components/theme/themePanel.svelte';

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);
	let showThemePanel = $state(false);

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
			const data = await fetchBackend(fetch, '/profile/getUserData');
			userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
			userData.keyStatistics = JSON.parse(data?.keyStatistics);
			goto('/account');
		} catch (e) {
			console.error(e);
		}
	}

	function toggleThemeEditor() {
		showThemePanel = !showThemePanel;
	}

	const navigationObject = $derived({
		'/': 'Home',
		'/config': 'Config',
		'/profile': `Profile ${userData.username}`
	});

	const pageHelperButtons: { [path: string]: [string, () => void] } = {
		'/config': ['Save', saveConfig],
		'/profile': ['Logout', logout],
		'/': ['Theme', toggleThemeEditor]
	};

	let appBind: HTMLElement;
	$effect(() => {
		if (appBind) {
			appBind.style.setProperty('--background-color', userData.userTypingConfig.colorScheme.backgroundColor.value);
			appBind.style.setProperty('--primary-color', userData.userTypingConfig.colorScheme.primaryColor.value);
			appBind.style.setProperty('--secondary-color', userData.userTypingConfig.colorScheme.secondaryColor.value);
			appBind.style.setProperty('--text-color', userData.userTypingConfig.colorScheme.textColor.value);
			appBind.style.setProperty('--accent-color', userData.userTypingConfig.colorScheme.accentColor.value);
		}
	});
</script>

<div id="app" bind:this={appBind}>
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
							showThemePanel = false;
							goto(path);
						}}
					>
						{title}
					</button>
				{/if}
			{/each}
		</div>
	</header>

	{#if showThemePanel}
		<div style="position: relative">
			<ThemePanel />
		</div>
	{/if}
	{@render children()}

	<footer></footer>
</div>

<style>
	#app {
		width: 100%;
		height: 100dvh;
		padding: 0 10% 0 10%;
		background-color: var(--background-color);
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
		left: 50%;
		top: var(--spacing-medium);
		gap: var(--spacing-small);
		transform: translateX(-50%);
		display: flex;
		z-index: 1000;
		flex-direction: column;
	}
</style>
