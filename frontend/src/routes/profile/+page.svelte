<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';
	import ProfileOverview from '../../components/profile/profileOverview.svelte';
	import { userData } from '../../shared/userData.svelte';

	function logout() {
		try {
			fetchBackend(fetch, '/auth/logout', { method: 'POST' });
			userData.username = '';
			goto('/account');
		} catch (e) {
			console.error(e);
		}
	}
</script>

<!-- <ProfileOverview username={data.username} testsStarted={data.testsStarted} testsCompleted={data.testsCompleted} /> -->

<button onclick={logout}>Logout</button>

<style>
</style>
