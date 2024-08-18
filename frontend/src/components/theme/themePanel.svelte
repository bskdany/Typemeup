<script lang="ts">
	import BubbleContainer from '../../components/common/bubbleContainer.svelte';
	import { userData } from '../../shared/userData.svelte';
	console.log(Object.values(userData.colorScheme));
</script>

<div id="theme">
	<BubbleContainer>
		{#each Object.entries(userData.colorScheme) as [key, colorScheme]}
			<div class="color-choser">
				<div style="display: flex; justify-content: center; align-items:center">{colorScheme.name}</div>
				<div class="color-display" style="background-color: {colorScheme.value};">
					<input type="color" bind:value={userData.colorScheme[key].value} />
				</div>
			</div>
		{/each}
	</BubbleContainer>
</div>

<style>
	#theme {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-medium);
		color: var(--text-color);
		width: min-content;
	}

	.color-choser {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: var(--spacing-medium);
	}

	.color-display {
		border-radius: var(--border-radius);
		border: 1px solid white;
	}

	input {
		opacity: 0%;
	}
</style>
