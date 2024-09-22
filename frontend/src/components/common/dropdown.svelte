<script lang="ts">
	import { icons } from '../../lib/icons';

	let { options, selectedOption, onOptionSelected }: { options: readonly any[]; selectedOption?: any; onOptionSelected: (arg0: any) => void } = $props();

	let isDropdownExpanded = $state(false);
</script>

<div class="dropDownWrapper">
	<button style="display: flex; align-items: center; justify-content: center; gap: 2px " onclick={() => (isDropdownExpanded = !isDropdownExpanded)}>
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
				{#each options as option}
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
			</div>
		{/if}
	</div>
</div>

<style>
	.dropDownWrapper {
		min-width: 100px;
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
		background-color: var(--secondary-color);
		border-radius: var(--border-radius);
		z-index: 100;
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
</style>
