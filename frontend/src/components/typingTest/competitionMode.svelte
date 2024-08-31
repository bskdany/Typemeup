<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { userData } from '../../shared/userData.svelte';
	import TypingTest from './typingTest.svelte';
	import type { TypingTestRunData } from '../../types/interfaces';
	import { getWebSocket } from '../../lib/fetch';

	let socket: WebSocket;
	let competitionStatus: 'waiting' | 'inProgress' | 'finished' = 'waiting';
	let playersProgress: { userId: string; progress: number }[] = [];
	let targetText: string[] = [];

	onMount(() => {
		socket = getWebSocket('/compete');
		socket.onopen = () => {
			socket.send(JSON.stringify({ type: 'join', userId: userData.username }));
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'waiting':
					competitionStatus = 'waiting';
					break;
				case 'matchFound':
					competitionStatus = 'inProgress';
					targetText = data.targetText;
					playersProgress = data.players.map((userId: string) => ({ userId, progress: 0 }));
					break;
				case 'progressUpdate':
					playersProgress = data.players;
					break;
				case 'competitionEnd':
					competitionStatus = 'finished';
					// Handle end of competition
					break;
			}
		};
	});

	onDestroy(() => {
		if (socket) {
			socket.close();
		}
	});

	function handleTypingProgress(progress: number) {
		socket.send(JSON.stringify({ type: 'progress', progress }));
	}

	function handleTypingEnd(data: TypingTestRunData) {
		socket.send(JSON.stringify({ type: 'finished', data }));
	}
</script>

{#if competitionStatus === 'waiting'}
	<div>Waiting for opponents...</div>
{:else if competitionStatus === 'inProgress'}
	<div>
		{#each playersProgress as player}
			<div class="progress-container">
				<div class="progress-bar" style="width: {player.progress}%;">
					<span class="progress-text">{player.userId}: {player.progress}%</span>
				</div>
			</div>
		{/each}

		<TypingTest {targetText} errorCorrectionMode={2} typingEndMode="words" onProgress={handleTypingProgress} testEnded={handleTypingEnd} />
	</div>
{:else}
	<div>Competition finished!</div>
{/if}

<style>
	.progress-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 5px;
		margin-bottom: 20px;
	}

	.progress-bar {
		height: 30px;
		background-color: #4caf50;
		border-radius: 5px;
		transition: width 0.5s ease-in-out;
	}

	.progress-text {
		color: white;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		padding-right: 10px;
		font-weight: bold;
	}
</style>
