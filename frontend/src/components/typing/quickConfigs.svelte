<script lang="ts">
	import { icons } from '../../lib/icons';
	import { typingEndModes, typingEndTimeModes, typingEndWordModes, typingModes, userData } from '../../shared/userData.svelte';
	import Dropdown from '../common/dropdown.svelte';
	import AdditionalQuickConfigs from './additionalQuickConfigs.svelte';

	let showAdditionalQuickConfigs = $state(false);
</script>

<div id="quickConfigs">
	<div id="quickConfigsMobile">
		<Dropdown
			options={typingModes}
			selectedOption={userData.userTypingConfig.typingMode}
			onOptionSelected={(typingMode) => {
				userData.userTypingConfig.typingMode = typingMode;
				if (typingMode === 'smart' || typingMode === 'compete') {
					userData.userTypingConfig.typingEndMode = 'words';
				}
				showAdditionalQuickConfigs = false;
			}}
		/>

		{#if userData.userTypingConfig.typingMode !== 'compete'}
			<div class="separator"></div>
		{/if}

		{#if userData.userTypingConfig.typingMode === 'test'}
			<Dropdown
				options={typingEndModes}
				selectedOption={userData.userTypingConfig.typingEndMode}
				onOptionSelected={(typingEndMode) => {
					userData.userTypingConfig.typingEndMode = typingEndMode;
				}}
			/>

			<div class="separator"></div>

			{#if userData.userTypingConfig.typingEndMode === 'words'}
				<Dropdown
					options={typingEndWordModes}
					selectedOption={userData.userTypingConfig.typingEndWordMode}
					onOptionSelected={(typingEndWordMode) => {
						userData.userTypingConfig.typingEndWordMode = typingEndWordMode;
					}}
				/>
			{:else if userData.userTypingConfig.typingEndMode === 'time'}
				<Dropdown
					options={typingEndTimeModes}
					selectedOption={userData.userTypingConfig.typingEndTimeMode}
					onOptionSelected={(typingEndTimeMode) => {
						userData.userTypingConfig.typingEndTimeMode = typingEndTimeMode;
					}}
				/>
			{/if}

			<div class="separator"></div>

			<button style="display: flex; align-items: center; gap: 2px" onclick={() => (showAdditionalQuickConfigs = !showAdditionalQuickConfigs)}>
				<div>more</div>
				<div class="icon-container">
					{@html icons.dropdown}
				</div>
			</button>
		{:else if userData.userTypingConfig.typingMode === 'smart'}
			<Dropdown
				options={typingEndWordModes}
				selectedOption={userData.userTypingConfig.typingEndWordMode}
				onOptionSelected={(typingEndWordMode) => {
					userData.userTypingConfig.typingEndWordMode = typingEndWordMode;
				}}
			/>
			<div class="separator"></div>

			<button style="display: flex; align-items: center; gap: 2px" onclick={() => (showAdditionalQuickConfigs = !showAdditionalQuickConfigs)}>
				<div>more</div>
				<div class="icon-container">
					{@html icons.dropdown}
				</div>
			</button>
		{/if}
	</div>

	<div id="quickConfigsDesktop">
		{#each typingModes as typingMode}
			<button
				class:selected-text={userData.userTypingConfig.typingMode === typingMode}
				onclick={() => {
					userData.userTypingConfig.typingMode = typingMode;
					if (typingMode === 'smart' || typingMode === 'compete') {
						userData.userTypingConfig.typingEndMode = 'words';
					}
				}}
			>
				{typingMode}
			</button>
		{/each}

		{#if userData.userTypingConfig.typingMode !== 'compete'}
			<div class="separator"></div>
		{/if}

		{#if userData.userTypingConfig.typingMode === 'test'}
			{#each typingEndModes as typingEndMode}
				<button
					class:selected-text={userData.userTypingConfig.typingEndMode === typingEndMode}
					onclick={() => (userData.userTypingConfig.typingEndMode = typingEndMode)}
				>
					{typingEndMode}
				</button>
			{/each}

			<div class="separator"></div>

			{#if userData.userTypingConfig.typingEndMode === 'words'}
				{#each typingEndWordModes as typingEndWordMode}
					<button
						class:selected-text={userData.userTypingConfig.typingEndWordMode === typingEndWordMode}
						onclick={() => (userData.userTypingConfig.typingEndWordMode = typingEndWordMode)}
					>
						{typingEndWordMode}
					</button>
				{/each}
			{:else if userData.userTypingConfig.typingEndMode === 'time'}
				{#each typingEndTimeModes as typingEndTimeMode}
					<button
						class:selected-text={userData.userTypingConfig.typingEndTimeMode === typingEndTimeMode}
						onclick={() => (userData.userTypingConfig.typingEndTimeMode = typingEndTimeMode)}
					>
						{typingEndTimeMode}
					</button>
				{/each}
			{/if}

			<div class="separator"></div>

			<button style="display: flex; align-items: center; gap: 2px" onclick={() => (showAdditionalQuickConfigs = !showAdditionalQuickConfigs)}>
				<div>more</div>
				<div class="icon-container">
					{@html icons.dropdown}
				</div>
			</button>
		{:else if userData.userTypingConfig.typingMode === 'smart'}
			{#each typingEndWordModes as typingEndWordMode}
				<button
					class:selected-text={userData.userTypingConfig.typingEndWordMode === typingEndWordMode}
					onclick={() => (userData.userTypingConfig.typingEndWordMode = typingEndWordMode)}
				>
					{typingEndWordMode}
				</button>
			{/each}
			<div class="separator"></div>

			<button style="display: flex; align-items: center; gap: 2px" onclick={() => (showAdditionalQuickConfigs = !showAdditionalQuickConfigs)}>
				<div>more</div>
				<div class="icon-container">
					{@html icons.dropdown}
				</div>
			</button>
		{/if}
	</div>

	{#if showAdditionalQuickConfigs}
		<AdditionalQuickConfigs />
	{:else}
		<div style="visibility: hidden">
			<AdditionalQuickConfigs />
		</div>
	{/if}
</div>

<style>
	button {
		font-size: 1rem;
		background-color: var(--secondary-color);
	}

	.separator {
		width: 1px;
		background-color: var(--text-color);
	}

	#quickConfigs {
		margin: auto;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
	}

	#quickConfigsMobile,
	#quickConfigsDesktop {
		display: flex;
		flex-direction: row;
		padding: var(--padding-medium);
		border-radius: var(--border-radius);
		background-color: var(--secondary-color);
		height: fit-content;
		width: fit-content;
		margin: auto;
	}

	@media screen and (min-width: 768px) {
		#quickConfigsDesktop {
			display: flex;
		}

		#quickConfigsMobile {
			display: none;
		}
	}

	@media screen and (max-width: 768px) {
		#quickConfigsDesktop {
			display: none;
		}

		#quickConfigsMobile {
			display: flex;
		}
	}
</style>
