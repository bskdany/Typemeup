<script lang="ts">
	import { fetchBackend } from '../../lib/fetch';
	import { loadWordsFile, userData } from '../../shared/userData.svelte';
	import available_languages from '../../static/avaialable_languages.json';
	import Dropdown from '../common/dropdown.svelte';

	async function saveUserTypingConfig() {
		try {
			await fetchBackend(fetch, '/profile/saveUserTypingConfig', { method: 'POST', body: { userTypingConfig: userData.userTypingConfig } });
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div class="bubble" id="additionalQuickConfigs">
	<Dropdown
		options={available_languages}
		selectedOption={userData.userTypingConfig.typingLanguage}
		onOptionSelected={async (option) => {
			await loadWordsFile(option);
			await saveUserTypingConfig();
		}}
	/>
</div>

<style>
	/* #additionalQuickConfigs { */
	/* 	display: flex; */
	/* 	justify-content: center; */
	/* 	align-items: center; */
	/* } */
</style>
