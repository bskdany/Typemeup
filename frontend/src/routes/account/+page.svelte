<script lang="ts">
	import { goto } from '$app/navigation';
	import LoginToAccount from '../../components/account/loginToAccount.svelte';
	import RegisterAccount from '../../components/account/registerAccount.svelte';

	let loginOrRegister: string = 'login';
</script>

<div id="container">
	{#if loginOrRegister === 'login'}
		<LoginToAccount />
	{:else}
		<RegisterAccount
			on:accountRegistered={() => {
				loginOrRegister = 'login';
			}}
		/>
	{/if}
	<button on:click={() => (loginOrRegister = loginOrRegister === 'login' ? 'register' : 'login')}
		>{loginOrRegister === 'login' ? 'Register instead' : 'Login instead'}</button
	>
</div>

<style>
	#container {
		display: flex;
		justify-content: center;
		width: min-content;
		align-items: center;
		flex-direction: column;
		gap: var(--spacing-medium);
	}
</style>
