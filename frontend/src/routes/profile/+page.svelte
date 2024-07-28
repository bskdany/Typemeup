<script lang="ts">
	import { goto } from '$app/navigation';
	import { getData } from '../../api/fetch';

	function logout() {
		try {
			getData('/auth/logout', { method: 'POST' });
			goto('/account');
		} catch (e) {
			console.error(e);
		}
	}
</script>

<button onclick={logout}>Logout</button>

PROFILE

<style>
</style>
