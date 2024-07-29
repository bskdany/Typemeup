<script lang="ts">
	import { goto } from '$app/navigation';
	import { getData } from '../../api/fetch';
	import ProfileOverview from '../../components/profile/profileOverview.svelte';

	export let data;
	console.log(data);

	function logout() {
		try {
			getData('/auth/logout', { method: 'POST' });
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
