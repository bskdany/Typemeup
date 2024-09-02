<script lang="ts">
	import SingleDataContainer from '../../common/singleDataContainer.svelte';

	const {
		wpm,
		accuracy,
		competitionRanking,
		playerName,
		restart
	}: { wpm: string; accuracy: string; competitionRanking: { playerName: string; rank: number }[]; playerName: string; restart: () => void } = $props();

	let playerRank = competitionRanking.find((player) => player.playerName === playerName)?.rank ?? 0;

	function rankingTextFormatter(ranking: number) {
		if (ranking === 1) {
			return 'st';
		} else if (ranking === 2) {
			return 'nd';
		} else if (ranking === 3) {
			return 'rd';
		} else {
			return 'th';
		}
	}
</script>

<div id="typingResult" class="bubble">
	<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--spacing-medium); width: 100%;">
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
			<div style="font-size: 3rem; color: var(--accent-color); position: relative; bottom: 0">
				{playerRank}
			</div>
			<div style="position: relative; bottom: 0;">
				{rankingTextFormatter(playerRank)} place
			</div>
		</div>

		<div style="display: flex; flex-direction: column; gap: var(--spacing-medium); align-items: center; justify-content: center;">
			<div style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-small);">
				{#each competitionRanking as ranking}
					{#if ranking.playerName === playerName}
						<div style="color: var(--accent-color);">{ranking.rank}. {ranking.playerName}</div>
					{:else}
						<div>{ranking.rank}. {ranking.playerName}</div>
					{/if}
				{/each}
			</div>
		</div>

		<div>
			<SingleDataContainer title="wpm" data={wpm} data_rem={2.5} />
			<SingleDataContainer title="accuracy" data={accuracy + '%'} data_rem={2.5} />
		</div>
	</div>

	<div>
		<button onclick={() => restart()}>Find new game (or press tab!)</button>
	</div>
</div>

<style>
	#typingResult {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		gap: var(--spacing-medium);
		width: auto;
		height: fit-content;
	}

	/* #restartButton {
		font-size: 1rem;
	} */
</style>
