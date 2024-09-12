<script lang="ts">
	import LoginToAccount from '../../components/account/loginToAccount.svelte';
	import RegisterAccount from '../../components/account/registerAccount.svelte';
	import { fetchBackend } from '../../lib/fetch';

	let loginOrRegister: string = 'login';

	async function loginWithGithub() {
		window.location.href = import.meta.env.VITE_URL_BACKEND + '/auth/github/login';
	}
</script>

<div id="container">
	<div style="display: flex; flex-direction: column; gap: var(--spacing-large);">
		{#if loginOrRegister === 'login'}
			<LoginToAccount />
		{:else}
			<RegisterAccount
				on:accountRegistered={() => {
					loginOrRegister = 'login';
				}}
			/>
		{/if}
		<button onclick={() => (loginOrRegister = loginOrRegister === 'login' ? 'register' : 'login')}
			>{loginOrRegister === 'login' ? 'Register instead' : 'Login instead'}</button
		>
	</div>

	<div>
		<button onclick={loginWithGithub}>Login with github</button>
	</div>
</div>

<style>
	#container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
