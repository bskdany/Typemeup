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
			appBind.style.setProperty('--background-color', userData.userTypingConfig.theme.colorScheme.backgroundColor.value);
			appBind.style.setProperty('--primary-color', userData.userTypingConfig.theme.colorScheme.primaryColor.value);
			appBind.style.setProperty('--secondary-color', userData.userTypingConfig.theme.colorScheme.secondaryColor.value);
			appBind.style.setProperty('--text-color', userData.userTypingConfig.theme.colorScheme.textColor.value);
			appBind.style.setProperty('--accent-color', userData.userTypingConfig.theme.colorScheme.accentColor.value);
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

		<a href="https://github.com/bskdany/typemeup" target="_blank" style="display: flex; height: 1rem; align-items: center; gap: 2px">
			<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0,0,256,256">
				<g
					fill-opacity="0.67059"
					fill="var(--text-color)"
					fill-rule="nonzero"
					stroke="none"
					stroke-width="1"
					stroke-linecap="butt"
					stroke-linejoin="miter"
					stroke-miterlimit="10"
					stroke-dasharray=""
					stroke-dashoffset="0"
					font-family="none"
					font-weight="none"
					font-size="none"
					text-anchor="none"
					style="mix-blend-mode: normal"
					><g transform="scale(10.66667,10.66667)"
						><path
							d="M10.9,2.1c-4.6,0.5 -8.3,4.2 -8.8,8.7c-0.5,4.7 2.2,8.9 6.3,10.5c0.3,0.1 0.6,-0.1 0.6,-0.5v-1.6c0,0 -0.4,0.1 -0.9,0.1c-1.4,0 -2,-1.2 -2.1,-1.9c-0.1,-0.4 -0.3,-0.7 -0.6,-1c-0.3,-0.1 -0.4,-0.1 -0.4,-0.2c0,-0.2 0.3,-0.2 0.4,-0.2c0.6,0 1.1,0.7 1.3,1c0.5,0.8 1.1,1 1.4,1c0.4,0 0.7,-0.1 0.9,-0.2c0.1,-0.7 0.4,-1.4 1,-1.8c-2.3,-0.5 -4,-1.8 -4,-4c0,-1.1 0.5,-2.2 1.2,-3c-0.1,-0.2 -0.2,-0.7 -0.2,-1.4c0,-0.4 0,-1 0.3,-1.6c0,0 1.4,0 2.8,1.3c0.5,-0.2 1.2,-0.3 1.9,-0.3c0.7,0 1.4,0.1 2,0.3c1.3,-1.3 2.8,-1.3 2.8,-1.3c0.2,0.6 0.2,1.2 0.2,1.6c0,0.8 -0.1,1.2 -0.2,1.4c0.7,0.8 1.2,1.8 1.2,3c0,2.2 -1.7,3.5 -4,4c0.6,0.5 1,1.4 1,2.3v2.6c0,0.3 0.3,0.6 0.7,0.5c3.7,-1.5 6.3,-5.1 6.3,-9.3c0,-6 -5.1,-10.7 -11.1,-10z"
						></path></g
					></g
				>
			</svg>
			<div>github</div>
		</a>

		<a href="https://discord.gg/YdcJdE4HBv" target="_blank" style="display: flex; height: 1rem; align-items: center;  gap: 2px">
			<svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0,0,256,256">
				<g
					fill-opacity="0.7098"
					fill="var(--text-color)"
					fill-rule="nonzero"
					stroke="none"
					stroke-width="1"
					stroke-linecap="butt"
					stroke-linejoin="miter"
					stroke-miterlimit="10"
					stroke-dasharray=""
					stroke-dashoffset="0"
					font-family="none"
					font-weight="none"
					font-size="none"
					text-anchor="none"
					style="mix-blend-mode: normal"
					><g transform="scale(8.53333,8.53333)"
						><path
							d="M25.12,6.946c-2.424,-1.948 -6.257,-2.278 -6.419,-2.292c-0.256,-0.022 -0.499,0.123 -0.604,0.357c-0.004,0.008 -0.218,0.629 -0.425,1.228c2.817,0.493 4.731,1.587 4.833,1.647c0.478,0.278 0.638,0.891 0.359,1.368c-0.185,0.318 -0.52,0.496 -0.864,0.496c-0.171,0 -0.343,-0.043 -0.501,-0.135c-0.028,-0.017 -2.836,-1.615 -6.497,-1.615c-3.662,0 -6.471,1.599 -6.499,1.615c-0.477,0.277 -1.089,0.114 -1.366,-0.364c-0.277,-0.476 -0.116,-1.087 0.36,-1.365c0.102,-0.06 2.023,-1.158 4.848,-1.65c-0.218,-0.606 -0.438,-1.217 -0.442,-1.225c-0.105,-0.235 -0.348,-0.383 -0.604,-0.357c-0.162,0.013 -3.995,0.343 -6.451,2.318c-1.284,1.186 -3.848,8.12 -3.848,14.115c0,0.106 0.027,0.209 0.08,0.301c1.771,3.11 6.599,3.924 7.699,3.959c0.007,0.001 0.013,0.001 0.019,0.001c0.194,0 0.377,-0.093 0.492,-0.25l1.19,-1.612c-2.61,-0.629 -3.99,-1.618 -4.073,-1.679c-0.444,-0.327 -0.54,-0.953 -0.213,-1.398c0.326,-0.443 0.95,-0.541 1.394,-0.216c0.037,0.024 2.584,1.807 7.412,1.807c4.847,0 7.387,-1.79 7.412,-1.808c0.444,-0.322 1.07,-0.225 1.395,0.221c0.324,0.444 0.23,1.066 -0.212,1.392c-0.083,0.061 -1.456,1.048 -4.06,1.677l1.175,1.615c0.115,0.158 0.298,0.25 0.492,0.25c0.007,0 0.013,0 0.019,-0.001c1.101,-0.035 5.929,-0.849 7.699,-3.959c0.053,-0.092 0.08,-0.195 0.08,-0.301c0,-5.994 -2.564,-12.928 -3.88,-14.14zM11,19c-1.105,0 -2,-1.119 -2,-2.5c0,-1.381 0.895,-2.5 2,-2.5c1.105,0 2,1.119 2,2.5c0,1.381 -0.895,2.5 -2,2.5zM19,19c-1.105,0 -2,-1.119 -2,-2.5c0,-1.381 0.895,-2.5 2,-2.5c1.105,0 2,1.119 2,2.5c0,1.381 -0.895,2.5 -2,2.5z"
						></path></g
					></g
				>
			</svg>
			<div>discord</div>
		</a>
	</footer>
</div>

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
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: var(--spacing-medium);
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

	#themePanel {
		position: absolute;
		left: 0%;
		top: 0%;
		height: min-content;
		width: min-content;
		z-index: 100;
	}
</style>
