<script lang="ts">
	import { loadWordsFile, userData } from '../../shared/userData.svelte';
	import available_languages from '../../static/avaialable_languages.json';
	import Dropdown from '../common/dropdown.svelte';
</script>

<div class="bubble" id="additionalQuickConfigs">
	<Dropdown
		options={available_languages}
		selectedOption={userData.userTypingConfig.typingLanguage}
		onOptionSelected={async (option) => {
			await loadWordsFile(option);
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
