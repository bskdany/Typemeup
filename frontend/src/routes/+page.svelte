<script lang="ts">
	import '../global.css';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import TypingTestContainer from '../components/typingTestContainer/typingTestContainer.svelte';

	function navigateToProfile() {
		goto('/profile');
	}
</script>

<button id="profilePage" onclick={() => alert('disabled as in early development')}> Profile </button>
<div id="typingArea">
	<TypingTestContainer />
</div>

<style>
	#typingArea {
		width: 80%;
		height: 70%;
	}

	#profilePage {
		position: absolute;
		right: 30px;
		top: 30px;
	}

	@media only screen and (max-width: 767px) {
		#typingArea {
			width: 90%;
		}
	}
</style>
