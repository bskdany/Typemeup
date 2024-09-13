<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';
	import { showToast } from '../../shared/toastController.svelte';
	import { userData } from '../../shared/userData.svelte';

	let username: string = '';
	let password: string = '';

	const loginToAccount = async () => {
		try {
			await fetchBackend(fetch, '/auth/login', { method: 'POST', body: { username: username, password: password } });
			const data = await fetchBackend(fetch, '/profile/getUserData');
			userData.username = data?.username;
			userData.userTypingConfig = JSON.parse(data?.userTypingConfig);
			userData.keyStatistics = JSON.parse(data?.keyStatistics);
			goto('/profile');
		} catch (error) {
			showToast({ message: error as string, type: 'error' });
		}
	};
</script>

<div id="loginWrapper">
	<input placeholder="username" bind:value={username} />
	<input type="password" placeholder="password" bind:value={password} />
	<button on:click={loginToAccount}>Login</button>
</div>

<style>
	#loginWrapper {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-small);
	}

	button {
		padding: var(--spacing-medium);
	}
</style>
