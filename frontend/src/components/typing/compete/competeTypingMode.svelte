<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { userData } from '../../../shared/userData.svelte';
	import TypingTest from '../typingTest.svelte';
	import type { TypingContext, TypingContextData, TypingTestRunData } from '../../../types/interfaces';
	import { getWebSocket } from '../../../lib/fetch';
	import CompeteTypingModeResult from './competeTypingModeResult.svelte';
	import TypingProgress from '../typingProgress.svelte';
	import { getAccuracy, getWpm } from '../../../lib/typingTestRunHelper';

	const { onTypingStart, onTypingEnd }: { onTypingStart: () => void; onTypingEnd: (data: TypingTestRunData) => void } = $props();

	let typingTestRef: TypingTest;
	let socket: WebSocket;
	let competitionStatus: 'waiting' | 'inProgress' | 'finished' | 'terminated' = $state('waiting');
	let playersProgress: { userId: string; progress: number }[] = $state([]);
	let targetText: string[] = $state([]);
	let typingTestRunData: TypingTestRunData;
	let competitionRanking: { playerName: string; rank: number }[] = $state([]);
	let playerName: string = $state('');
	let playersWaiting: number = $state(0);

	let displayCountdown: boolean = $state(false);
	let displayTimer: boolean = $state(false);
	let countdownTime: number = $state(3);
	let remainingTime: number = $state(30);

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	function startCountdown() {
		displayCountdown = true;
		const countdownInterval = setInterval(() => {
			countdownTime--;
		}, 1000);

		setTimeout(() => {
			clearInterval(countdownInterval);
			displayCountdown = false;
		}, 3000);
	}

	onMount(() => {
		document.addEventListener('keydown', handleTabKeyDown);

		socket = getWebSocket();
		socket.onopen = () => {
			socket.send(JSON.stringify({ type: 'join', userId: userData.username }));
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'waiting':
					competitionStatus = 'waiting';
					console.log(playerName);
					playerName = data.playerName;
					playersWaiting = data.playersWaiting;
					break;
				case 'matchFound':
					competitionStatus = 'inProgress';
					targetText = data.targetText;
					playersProgress = data.players.map((userId: string) => ({ userId, progress: 0 }));
					break;
				case 'progressUpdate':
					playersProgress = data.players;
					break;
				case 'startCountdown':
					startCountdown();
					break;

				case 'finished':
					competitionStatus = 'finished';
					console.log(data);
					competitionRanking = data.rankings;
					break;

				case 'terminated':
					competitionStatus = 'terminated';
					competitionRanking = data.rankings;
					break;

				case 'firstFinisherNotification':
					displayTimer = true;
					const timerInterval = setInterval(() => {
						remainingTime--;
					}, 1000);

					setTimeout(() => {
						clearInterval(timerInterval);
						displayTimer = false;
					}, 30000);
					break;
			}
		};
	});

	onDestroy(() => {
		if (socket) {
			socket.close();
		}

		try {
			document.removeEventListener('keydown', handleTabKeyDown);
		} catch (e) {}
	});

	function handleTypingProgress(progress: number) {
		socket.send(JSON.stringify({ type: 'progress', progress }));
	}

	function handleTypingEnd(data: TypingTestRunData) {
		typingTestRunData = data;
		socket.send(JSON.stringify({ type: 'progress', progress: 100 }));
		socket.send(JSON.stringify({ type: 'finished', data }));
		onTypingEnd(data);
	}

	function handleTabKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (competitionStatus === 'finished') {
				competitionStatus = 'waiting';
			}
		}

		typingTestRef?.focus();
	}
</script>

{#if competitionStatus === 'waiting'}
	<div>Waiting for opponents ({playersWaiting}/3)...</div>
{:else if competitionStatus === 'inProgress'}
	<div>
		{#each playersProgress as player}
			<div class="progress-container">
				<div class="progress-bar" style="width: {player.progress}%;">
					<span class="progress-text">{player.userId}: {player.progress}%</span>
				</div>
			</div>
		{/each}

		<div style="display: flex; flex-direction: row; justify-content: space-between;">
			{#if displayCountdown}
				<div class="timer">{countdownTime}</div>
			{/if}

			{#if typingContextData.typingTestStatus === 'started'}
				<TypingProgress />
			{:else}
				<div style="visibility: hidden;"><TypingProgress /></div>
			{/if}
			{#if displayTimer}
				<div class="timer">{remainingTime}</div>
			{/if}
		</div>

		{#if displayCountdown}
			<TypingTest
				bind:this={typingTestRef}
				{targetText}
				inputBlocked={true}
				errorCorrectionMode={2}
				typingEndMode="words"
				onProgress={handleTypingProgress}
				testEnded={handleTypingEnd}
			/>
		{:else}
			<TypingTest
				bind:this={typingTestRef}
				{targetText}
				errorCorrectionMode={2}
				typingEndMode="words"
				onProgress={handleTypingProgress}
				testEnded={handleTypingEnd}
			/>
		{/if}
	</div>
{:else if competitionStatus === 'finished'}
	<CompeteTypingModeResult
		wpm={getWpm(typingTestRunData).toString()}
		accuracy={getAccuracy(typingTestRunData).toString()}
		{competitionRanking}
		{playerName}
		restart={() => (competitionStatus = 'waiting')}
	/>
{:else if competitionStatus === 'terminated'}
	<CompeteTypingModeResult wpm={'N/A'} accuracy={'N/A'} {competitionRanking} {playerName} restart={() => (competitionStatus = 'waiting')} />
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

	.timer {
		font-size: 1.5rem;
		color: var(--accent-color);
	}
</style>
