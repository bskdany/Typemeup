<script lang="ts">
	import { loadWordsFile, userData } from '../../shared/userData.svelte';
	import available_languages from '../../static/avaialable_languages.json';
	import Dropdown from '../common/dropdown.svelte';
</script>

<div class="bubble">
	<div>Language</div>
	<Dropdown
		options={available_languages}
		selectedOption={userData.userTypingConfig.typingLanguage}
		onOptionSelected={async (option) => {
			userData.userTypingConfig.typingLanguage = option;
			await loadWordsFile(option);
		}}
	/>
</div>
