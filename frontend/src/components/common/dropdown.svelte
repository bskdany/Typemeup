<script lang="ts">
	import { icons } from '../../lib/icons';

	let { options, selectedOption, onOptionSelected }: { options: string[]; selectedOption?: any; onOptionSelected: (arg0: any) => void } = $props();

	function filterOptions(rule: string) {
		return options.filter((item) => item.toLowerCase().match(rule.toLowerCase()));
	}

	let isDropdownExpanded = $state(false);
	let searchInputValue: string = $state('');
	let filteredOptions = $derived(filterOptions(searchInputValue));
</script>

<div class="dropDownWrapper">
	<button style="height: 1px; padding-top: 0px; padding-bottom: 0px; visibility: hidden;">
		{options.reduce((longest, current) => (longest.length > current.length ? longest : current))}
	</button>

	<button
		style="display: flex; align-items: center; justify-content: center; gap: 2px "
		onclick={() => {
			isDropdownExpanded = !isDropdownExpanded;
			searchInputValue = '';
		}}
	>
		<div>
			{selectedOption}
		</div>
		<div class="icon-container">
			{@html icons.dropdown}
		</div>
	</button>
	<div style="position: relative">
		{#if isDropdownExpanded}
			<div id="dropdownOptions">
				{#if options.length >= 5}
					<!-- a workaroud I'm very non proud of to keep the width of the dropdown the same even after filtering -->
					<button style="height: 1px; width: 100%; padding-top: 0px; padding-bottom: 0px;">
						{options.reduce((longest, current) => (longest.length > current.length ? longest : current))}
					</button>

					<input placeholder="Search..." bind:value={searchInputValue} />
					<hr style="width: 100%; background-color: var(--primary-color);" />
				{/if}

				{#each filteredOptions as option}
					{#if option === selectedOption}
						<button class="option selected" onclick={() => (isDropdownExpanded = false)}>{option}</button>
					{:else}
						<button
							class="option"
							onclick={() => {
								onOptionSelected(option);
								isDropdownExpanded = false;
								selectedOption = option;
							}}>{option}</button
						>
					{/if}
				{/each}
				{#if filteredOptions.length === 0}
					<div style="margin: auto; margin-bottom: var(--spacing-small);">No results were found</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.dropDownWrapper {
		width: fit-content;
		height: min-content;
		display: flex;
		flex-direction: column;
	}

	#dropdownOptions {
		display: flex;
		flex-direction: column;
		width: max(100px, min-content);
		position: absolute;
		top: var(--spacing-medium);
		background-color: var(--secondary-color);
		border-radius: var(--border-radius);
		z-index: 100;
		max-height: 20rem;
		overflow-y: auto;
	}

	.option {
		color: var(--text-color);
	}

	.selected {
		color: var(--accent-color);
	}

	button {
		background-color: transparent;
		font-size: 1rem;
	}

	input {
		outline: none;
	}
</style>
