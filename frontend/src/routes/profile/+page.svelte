<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchBackend } from '../../lib/fetch';
	import ProfileOverview from '../../components/profile/profileOverview.svelte';
	import { userData } from '../../shared/userData.svelte';
</script>

<ProfileOverview />

<style>
</style>
