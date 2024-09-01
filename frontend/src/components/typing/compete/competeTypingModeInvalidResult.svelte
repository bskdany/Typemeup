<script lang="ts">
	import CompeteRankings from './competeRankings.svelte';
	const { competitionRanking, playerName }: { competitionRanking: { playerName: string; rank: number }[]; playerName: string } = $props();
</script>

<div class="bubble">
	<CompeteRankings {competitionRanking} {playerName} />

	<div>Competition has been terminated</div>
</div>
