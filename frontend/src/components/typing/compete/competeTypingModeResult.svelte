<script lang="ts">
	import SingleDataContainer from '../../common/singleDataContainer.svelte';
	import type { PlayersData } from '../../../types/interfaces';

	const {
		playersData,
		playerId,
		restart
	}: {
		playersData: PlayersData;
		playerId: string;
		restart: () => void;
	} = $props();

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

	console.log(playersData);
</script>

<div id="typingResult" class="bubble">
	<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--spacing-medium); width: 100%;">
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
			<div style="font-size: 3rem; color: var(--accent-color); position: relative; bottom: 0">
				{playersData[playerId]?.ranking}
			</div>
			<div style="position: relative; bottom: 0;">
				{rankingTextFormatter(playersData[playerId]?.ranking ?? 0)} place
			</div>
		</div>

		<div style="display: flex; flex-direction: column; gap: var(--spacing-medium); align-items: center; justify-content: center;">
			<div style="display: grid; grid-template-columns: 1fr; gap: var(--spacing-small);">
				{#each Object.entries(playersData) as [id, playerData]}
					{#if playerData.ranking > 0}
						<div style={playerId === id ? 'color: var(--accent-color);' : ''}>
							{playerData.ranking}. {playerData.name} wpm: {playerData.wpm} accuracy: {playerData.accuracy}%
						</div>
					{:else}
						{playerData.name} progress: {playerData.progress}%
					{/if}
				{/each}
			</div>
		</div>

		<div>
			<SingleDataContainer title="wpm" data={playersData[playerId]?.wpm} data_rem={2.5} />
			<SingleDataContainer title="accuracy" data={playersData[playerId]?.accuracy + '%'} data_rem={2.5} />
		</div>
	</div>

	<div>
		<button onclick={restart}>Find new game (or press tab!)</button>
	</div>
</div>
