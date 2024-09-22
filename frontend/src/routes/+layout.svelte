<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { hasInitialized, userData } from '../shared/userData.svelte';
	import { showToast, toastList } from '../shared/toastController.svelte';
	import Toast from '../components/common/toast.svelte';
	import { fetchBackend } from '../lib/fetch';
	import ThemePanel from '../components/theme/themePanel.svelte';
	import { icons } from '../lib/icons';
	import TypingTestLoad from '../components/typing/typingTestLoad.svelte';

	let { children } = $props();
	let currentPath = $derived($page.url.pathname);
	let showThemePanel = $state(false);

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

	let appBind: HTMLElement | undefined = $state();
	$effect(() => {
		if (appBind) {
			console.warn("Style updated");
			appBind.style.setProperty('--background-color', userData.userTypingConfig.theme.colorScheme.backgroundColor.value);
			appBind.style.setProperty('--primary-color', userData.userTypingConfig.theme.colorScheme.primaryColor.value);
			appBind.style.setProperty('--secondary-color', userData.userTypingConfig.theme.colorScheme.secondaryColor.value);
			appBind.style.setProperty('--text-color', userData.userTypingConfig.theme.colorScheme.textColor.value);
			appBind.style.setProperty('--accent-color', userData.userTypingConfig.theme.colorScheme.accentColor.value);
		}
	});

	$effect(() => {
		if (currentPath !== '/') {
			showThemePanel = false;
		}
	});
</script>

<svelte:head>
	<script defer src="https://analytics.bskdany.com/script.js" data-website-id={import.meta.env.VITE_ANALYTICS_ID}></script>
</svelte:head>
{#await hasInitialized()}
	<TypingTestLoad />
{:then}
	<div id="app" bind:this={appBind}>
		<div id="toastContainer">
			{#each toastList as toast}
				<Toast type={toast.type} message={toast.message} duration={toast.duration} />
			{/each}
		</div>

		<header>
			{#if currentPath === '/'}
				<div id="leftHeader">
					<button onclick={() => toggleThemeEditor()}>
						<div class="icon-container">
							{@html icons.theme}
						</div>
					</button>
				</div>
				<div id="rightHeader">
					<button onclick={() => goto('/config')}>
						<div class="icon-container">
							{@html icons.config}
						</div>
					</button>
					<button onclick={() => goto('/profile')} class="link">
						{#if userData.username === ''}
							<div class="icon-container">
								{@html icons.profile}
							</div>
						{:else}
							<div class="icon-container">
								{@html icons.profile}
							</div>
							<div>
								{userData.username}
							</div>
						{/if}
					</button>
				</div>
			{:else if currentPath === '/config'}
				<div id="leftHeader">
					<button onclick={() => goto('/')}>
						<div class="icon-container">
							{@html icons.home}
						</div>
					</button>
				</div>
			{:else if currentPath === '/profile'}
				<div id="leftHeader">
					<button onclick={() => goto('/')}>
						<div class="icon-container">
							{@html icons.home}
						</div>
					</button>
				</div>
				<div id="rightHeader">
					<button onclick={() => logout()}>Logout</button>
				</div>
			{:else}
				<div id="leftHeader">
					<button onclick={() => goto('/')}>
						<div class="icon-container">
							{@html icons.home}
						</div>
					</button>
				</div>
			{/if}
		</header>

		<div style="position: relative;">
			{#if showThemePanel}
				<div id="themePanel">
					<ThemePanel />
				</div>
			{/if}
			{@render children()}
		</div>

		<footer>
			<a href="/about">about</a>

			<a href="https://github.com/bskdany/typemeup" target="_blank" class="link">
				<div class="icon-container">
					{@html icons.github}
				</div>
				<div>github</div>
			</a>

			<a href="https://discord.gg/YdcJdE4HBv" target="_blank" class="link">
				<div class="icon-container">
					{@html icons.discord}
				</div>
				<div>discord</div>
			</a>
		</footer>
	</div>
{/await}

<style>
	#app {
		min-width: 100dvw;
		min-height: 100dvh;
		padding: 0 10% 0 10%;
		background-color: var(--background-color);
		display: grid;
		grid-template-rows: auto 1fr auto;
	}

	header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: var(--spacing-medium) 0 var(--spacing-medium) 0;
	}

	footer {
		font-size: 0.8rem;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: var(--spacing-medium);
	}

	#leftHeader {
		display: flex;
		flex-direction: row;
		justify-content: right;
		align-items: center;
		gap: var(--spacing-medium);
	}

	#rightHeader {
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

	#themePanel {
		position: absolute;
		left: 0%;
		top: 0%;
		height: min-content;
		width: min-content;
		z-index: 100;
	}

	.icon-container {
		display: flex;
		height: 1rem;
		width: 1rem;
		align-items: center;
		justify-content: center;
		gap: 2px;
	}

	.link {
		color: var(--secondary-color);
		display: flex;
		align-items: center;
		gap: 2px;
	}
</style>
