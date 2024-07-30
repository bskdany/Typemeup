<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';
	import { showToast } from '../../shared/toastController.svelte';

	let username: string = '';
	let password1: string = '';
	let password2: string = '';

	const registerAccount = async () => {
		if (password1 != password2) {
			showToast({ message: 'Passwords are different', type: 'error' });
			return;
		}
		try {
			await fetchBackend(fetch, '/auth/signup', { method: 'POST', body: { username: username, password: password1 } });
			goto('/profile');
		} catch (error) {
			showToast({ message: error as string, type: 'error' });
		}
	};
</script>

<div id="loginWrapper">
	<input placeholder="username" bind:value={username} />
	<input type="password" placeholder="password" bind:value={password1} />
	<input type="password" placeholder="repeat password" bind:value={password2} />
	<button on:click={registerAccount}>Register</button>
</div>

<style>
	#loginWrapper {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-small);
		width: min-content;
	}
</style>
