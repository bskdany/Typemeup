<script lang="ts">
	import '../global.css';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import TypingTestContainer from '../components/typingTestContainer/typingTestContainer.svelte';

	function navigateToProfile() {
		goto('/profile');
	}
</script>

<button id="profilePage" onclick={navigateToProfile}> Profile </button>

<TypingTestContainer />

<style>
	#profilePage {
		position: absolute;
		right: 30px;
		top: 30px;
	}
</style>
