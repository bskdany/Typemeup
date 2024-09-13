<script lang="ts">
	import LoginToAccount from '../../components/account/loginToAccount.svelte';
	import RegisterAccount from '../../components/account/registerAccount.svelte';

	function loginWithGithub() {
		window.location.href = import.meta.env.VITE_URL_BACKEND + '/auth/github/login';
	}

	function loginWithGoogle() {
		window.location.href = import.meta.env.VITE_URL_BACKEND + '/auth/google/login';
	}

	let useOauth = $state(true);
	let isLogin = $state(true);
</script>

<div id="container">
	<div style="text-align: center;">
		<h1>Track your progress, improve and compete</h1>
		<h3>Join the typing community, it's free!</h3>
	</div>

	<div style="display: flex; flex-direction: column; gap: var(--spacing-small); width: fit-content">
		{#if useOauth}
			<button onclick={loginWithGoogle}>Continue with Google</button>
			<button onclick={loginWithGithub}>Continue with Github</button>
			<button onclick={() => (useOauth = false)}>Use username instead</button>
		{:else}
			{#if isLogin}
				<LoginToAccount />
				<button onclick={() => (isLogin = false)}>Register instead</button>
			{:else}
				<RegisterAccount />
				<button onclick={() => (isLogin = false)}>Login instead</button>
			{/if}
			<button onclick={() => (useOauth = true)}>Use Auth Provider</button>
		{/if}
	</div>
</div>

<style>
	#container {
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		justify-items: center;
		align-items: center;
		height: 100%;
	}
	button {
		padding: var(--spacing-medium);
	}
</style>
