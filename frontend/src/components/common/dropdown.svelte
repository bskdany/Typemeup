<script lang="ts">
	const {
		title,
		options,
		defaultOption,
		onOptionSelected
	}: { title?: string; options: readonly any[]; defaultOption?: any; onOptionSelected: (arg0: any) => void } = $props();

	let selectedOption: any = $state(defaultOption);

	$effect(() => {
		onOptionSelected(selectedOption);
	});
</script>

<div class="dropDownWrapper">
	{title}
	<select class="dropdown" bind:value={selectedOption}>
		{#each options as option}
			<option class="option" value={option}>{option}</option>
		{/each}
	</select>
</div>

<style>
	.dropdown {
		color: var(--text-color);
		border: 1px solid var(--secondary-color);
		border-radius: var(--border-radius);
		background-color: var(--primary-color);
		padding: var(--padding-small);
	}
	.option {
		color: var(--text-color);
	}

	.dropdown:hover {
		color: var(--accent-color);
	}
</style>
