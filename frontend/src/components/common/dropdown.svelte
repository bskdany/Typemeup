<script lang="ts">
	const {
		title,
		options,
		defaultOption,
		onOptionSelected
	}: { title?: string; options: readonly any[]; defaultOption?: any; onOptionSelected: (arg0: any) => void } = $props();

	let selectedOption: any = $state(defaultOption);
</script>

<div class="dropDownWrapper">
	{title}
	<select class="dropdown" onclick={() => onOptionSelected(selectedOption)} bind:value={selectedOption}>
		{#each options as option}
			<option class="option" value={option}>{option}</option>
		{/each}
	</select>
</div>

<style>
	.dropDownWrapper {
		display: flex;
		justify-self: center;
		align-items: center;
		height: min-content;
		flex-direction: row;
		gap: var(--spacing-small);
	}

	.dropdown {
		color: var(--accent-color);
		border: 1px solid var(--primary-color);
		border-radius: var(--border-radius);
		background-color: var(--secondary-color);
		padding: var(--padding-small);
		outline: none;
	}
	.option {
		color: var(--text-color);
	}
</style>
