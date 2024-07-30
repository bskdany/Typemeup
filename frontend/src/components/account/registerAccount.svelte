<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';

	let username: string = '';
	let password1: string = '';
	let password2: string = '';
	let errorMessage: any = '';

	const registerAccount = async () => {
		if (password1 != password2) {
			errorMessage = 'Passwords are different';
			return;
		}
		try {
			await fetchBackend(fetch, '/auth/signup', { method: 'POST', body: { username: username, password: password1 } });
			goto('/profile');
		} catch (error) {
			errorMessage = error;
		}
	};
</script>

<div id="loginWrapper">
	<input placeholder="username" bind:value={username} />
	<input type="password" placeholder="password" bind:value={password1} />
	<input type="password" placeholder="repeat password" bind:value={password2} />
	<button on:click={registerAccount}>Register</button>
</div>
<div id="errorMessage">{errorMessage}</div>

<style>
	#loginWrapper {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-small);
		width: min-content;
	}
	#errorMessage {
		margin-top: 10px;
		color: rgb(215, 61, 61);
		height: 1rem;
	}
</style>
