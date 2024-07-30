<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';
	import { userData } from '../../shared/userData.svelte';

	let username: string = '';
	let password: string = '';
	let errorMessage: any = '';

	const loginToAccount = async () => {
		try {
			const data = await fetchBackend(fetch, '/auth/login', { method: 'POST', body: { username: username, password: password } });
			console.log(data);
			userData.username = data.username;
			goto('/profile');
		} catch (error) {
			errorMessage = error;
		}
	};
</script>

<div id="loginWrapper">
	<input placeholder="username" bind:value={username} />
	<input type="password" placeholder="password" bind:value={password} />
	<button on:click={loginToAccount}>Login</button>
</div>
<div id="errorMessage">{errorMessage}</div>

<style>
	#loginWrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: min-content;
	}
	input {
		border: solid transparent;
		padding: 10px;
		border-radius: 10px;
		background-color: #2c2e31;
		color: white;
	}
	#errorMessage {
		margin-top: 10px;
		color: rgb(215, 61, 61);
		height: 1rem;
	}
</style>
