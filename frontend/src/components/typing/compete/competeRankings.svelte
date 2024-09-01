<script lang="ts">
	const { competitionRanking, playerName }: { competitionRanking: { playerName: string; rank: number }[]; playerName: string } = $props();
</script>

<div style="display: flex; flex-direction: column; gap: var(--spacing-medium);">
	{#each competitionRanking as ranking}
		{#if ranking.playerName === playerName}
			<div style="color: var(--accent-color);">{ranking.rank}. {ranking.playerName}</div>
		{:else}
			<div>{ranking.rank}. {ranking.playerName}</div>
		{/if}
	{/each}
</div>
