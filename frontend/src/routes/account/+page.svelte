<script lang="ts">
	import LoginToAccount from '../../components/account/loginToAccount.svelte';
	import RegisterAccount from '../../components/account/registerAccount.svelte';

	let loginOrRegister: string = 'login';
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
		<button on:click={() => (loginOrRegister = loginOrRegister === 'login' ? 'register' : 'login')}
			>{loginOrRegister === 'login' ? 'Register instead' : 'Login instead'}</button
		>
	</div>
</div>

<style>
	#container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
