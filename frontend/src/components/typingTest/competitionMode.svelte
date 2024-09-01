<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { userData } from '../../shared/userData.svelte';
	import TypingTest from './typingTest.svelte';
	import type { TypingTestRunData } from '../../types/interfaces';
	import { getWebSocket } from '../../lib/fetch';

	let socket: WebSocket;
	let competitionStatus: 'waiting' | 'inProgress' | 'completed' | 'terminated' | 'error' = 'waiting';
	let playersProgress: { userId: string; progress: number }[] = [];
	let targetText: string[] = [];
	let rankings: { userId: string; rank: number }[] = [];
	let errorMessage: string = '';

	onMount(() => {
		socket = getWebSocket();
		socket.onopen = () => {
			socket.send(JSON.stringify({ type: 'join', userId: userData.username || '' }));
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
				case 'firstFinisher':
					competitionStatus = 'firstFinisher';
					break;
				case 'firstFinisherNotification':
					// Notify other users that the first user has finished
					alert(`${data.userId} has finished the competition! You have 30 seconds to complete.`);
					break;
				case 'competitionEnd':
					competitionStatus = 'finished';
					rankings = data.rankings;
					break;
				case 'error':
					competitionStatus = 'error';
					errorMessage = data.message;
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
{:else if competitionStatus === 'completed'}
	<div>
		<h2>Congratulations! You finished first!</h2>
		<p>Waiting for other players to finish...</p>
	</div>
{:else if competitionStatus === 'terminated'}
	<div>
		<h2>Competition finished!</h2>
		<ol>
			{#each rankings as { userId, rank }}
				<li>{userId} - Rank: {rank}</li>
			{/each}
		</ol>
	</div>
{:else if competitionStatus === 'error'}
	<div>
		<h2>Error</h2>
		<p>{errorMessage}</p>
	</div>
{/if}

<style>
	.progress-container {
		width: 100%;
		background-color: var(--primary-color);
		border-radius: var(--border-radius);
		margin-bottom: var(--spacing-medium);
	}

	.progress-bar {
		height: 30px;
		background-color: var(--accent-color);
		border-radius: var(--border-radius);
		transition: width 0.5s ease-in-out;
	}

	.progress-text {
		color: var(--text-color);
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100%;
		padding-right: 10px;
		font-weight: bold;
	}
</style>
