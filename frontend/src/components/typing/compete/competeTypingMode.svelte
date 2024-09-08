<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { userData } from '../../../shared/userData.svelte';
	import TypingTest from '../typingTest.svelte';
	import type { PlayersData, TypingContext, TypingContextData, TypingTestRunData } from '../../../types/interfaces';
	import { getWebSocket } from '../../../lib/fetch';
	import CompeteTypingModeResult from './competeTypingModeResult.svelte';
	import TypingProgress from '../typingProgress.svelte';
	import { getAccuracy, getWpm } from '../../../lib/typingTestRunHelper';
	import ProfileOverview from '../../profile/profileOverview.svelte';
	import { compile } from 'svelte/compiler';
	import TypingTestLoad from '../typingTestLoad.svelte';

	const { onTypingStart, onTypingEnd }: { onTypingStart: () => void; onTypingEnd: (data: TypingTestRunData) => void } = $props();

	let typingTestRef: TypingTest;
	let socket: WebSocket;
	let competitionStatus: 'waiting' | 'inProgress' | 'finished' | 'terminated' = $state('waiting');

	const COUNTDOWN_TIME = 3;
	const TIMER_TIME = 10;
	const PLAYERS_PER_COMPETITION = 3;

	// MAPS ARE NOT REACTIVE IN SVELTE5
	let playersData: PlayersData = $state({});

	let targetText: string[] = $state([]);
	let typingTestRunData: TypingTestRunData;
	let playerId: string = $state('');
	let playerName: string = $state('');

	let playersWaiting: number = $state(0);
	let displayCountdown: boolean = $state(false);
	let displayTimer: boolean = $state(false);
	let countdownTime: number = $state(COUNTDOWN_TIME);
	let remainingTime: number = $state(TIMER_TIME);

	const typingContext: TypingContext = getContext('typingContext') as TypingContext;
	const typingContextData: TypingContextData = typingContext.typingContextData;

	function startCountdown() {
		displayCountdown = true;
		let countdownInterval = setInterval(() => {
			countdownTime--;
		}, 1000);

		setTimeout(() => {
			clearInterval(countdownInterval);
			displayCountdown = false;
		}, COUNTDOWN_TIME * 1000);
	}

	function startTimeout() {
		displayTimer = true;
		const timerInterval = setInterval(() => {
			remainingTime--;
		}, 1000);

		setTimeout(() => {
			clearInterval(timerInterval);
			displayTimer = false;
		}, TIMER_TIME * 1000);
	}

	function joinWaitlist() {
		socket.send(JSON.stringify({ type: 'waitlist' }));
	}

	function restart() {
		competitionStatus = 'waiting';
		initializePlayersData();
		countdownTime = COUNTDOWN_TIME;
		remainingTime = TIMER_TIME;
		joinWaitlist();
	}

	function handleTypingProgress(progress: number) {
		socket.send(JSON.stringify({ type: 'progress', progress }));
	}

	function handleTypingEnd(data: TypingTestRunData) {
		typingTestRunData = data;
		socket.send(JSON.stringify({ type: 'progress', progress: 100 }));
		socket.send(JSON.stringify({ type: 'finished', wpm: getWpm(data), accuracy: getAccuracy(data) }));
		onTypingEnd(data);
	}

	function handleTabKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			if (competitionStatus === 'finished' || competitionStatus == 'terminated') {
				restart();
			}
		}

		typingTestRef?.focus();
	}

	function initializePlayersData() {
		for (let i = Object.keys(playersData).length; i < PLAYERS_PER_COMPETITION; i++) {
			playersData[i] = {
				name: '...',
				progress: 0,
				wpm: 0,
				accuracy: 0,
				ranking: 0
			};
		}
	}

	onMount(() => {
		initializePlayersData();
		document.addEventListener('keydown', handleTabKeyDown);

		socket = getWebSocket();
		socket.onopen = () => {
			socket.send(JSON.stringify({ type: 'initialize', name: userData.username }));
			joinWaitlist();
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'initialized': {
					playerId = data.playerData.playerId;
					playerName = data.playerData.playerName;
					break;
				}

				case 'waiting': {
					competitionStatus = 'waiting';

					// set the waiting players data to the playersData
					playersData = {};
					data.playersData.forEach((playerData: { name: string; playerId: string }) => {
						playersData[playerData.playerId] = {
							name: playerData.name,
							progress: 0,
							wpm: 0,
							accuracy: 0,
							ranking: 0
						};
					});

					playersWaiting = data.playersData.length;

					// add placeholder players to keep the number of playes always 3
					for (let i = Object.keys(playersData).length; i < PLAYERS_PER_COMPETITION; i++) {
						playersData[i] = {
							name: '...',
							progress: 0,
							wpm: 0,
							accuracy: 0,
							ranking: 0
						};
					}
					break;
				}

				case 'matchFound': {
					competitionStatus = 'inProgress';
					targetText = data.targetText;

					playersData = {};
					data.playersData.forEach((playerData: { name: string; playerId: string }) => {
						playersData[playerData.playerId] = {
							name: playerData.name,
							progress: 0,
							wpm: 0,
							accuracy: 0,
							ranking: 0
						};
					});

					break;
				}

				case 'progress': {
					const player = playersData[data.playerData.playerId];
					if (player) {
						player.progress = data.playerData.progress;
					}
					break;
				}

				case 'startCountdown': {
					startCountdown();
					break;
				}

				case 'finished': {
					const player = playersData[data.playerData.playerId];
					if (player) {
						player.ranking = data.playerData.ranking;
						player.wpm = data.playerData.wpm;
						player.accuracy = data.playerData.accuracy;
					}

					if (data.playerData.playerId === playerId) {
						competitionStatus = 'finished';
					}

					break;
				}

				case 'terminated':
					competitionStatus = 'terminated';
					break;

				case 'startTimeout':
					startTimeout();
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
</script>

{#if competitionStatus === 'waiting'}
	<div class="progress-container">
		{#each Object.entries(playersData) as [id, playerData]}
			<div class="player-progress">
				<div class="progress-bar" style="width: {playerData.progress}%;">
					<span class="progress-text">
						<span style={id === playerId ? 'color: var(--accent-color);' : 'color: var(--text-color);'}>{playerData.name}</span>
					</span>
				</div>
			</div>
		{/each}
		<div style="text-align: center;">Waiting for opponents ({playersWaiting}/3)...</div>
	</div>
{:else if competitionStatus === 'inProgress'}
	<div style="display: flex; flex-direction: column; gap: var(--spacing-medium);">
		<div class="progress-container">
			{#each Object.entries(playersData) as [id, playerData]}
				<div class="player-progress">
					<div class="progress-bar" style="width: {playerData.progress}%; }">
						<span class="progress-text">
							<span style={id === playerId ? 'color: var(--accent-color);' : 'color: var(--text-color);'}>{playerData.name}</span>
							<span style={id === playerId ? 'color: var(--accent-color);' : 'color: var(--text-color);'}>{playerData.progress}%</span>
						</span>
					</div>
				</div>
			{/each}
		</div>

		<div>
			<div style="display: flex; flex-direction: row; justify-content: space-between;">
				{#if displayCountdown}
					<div class="progress-info">{countdownTime}</div>
				{/if}

				{#if typingContextData.typingTestStatus === 'started'}
					<div class="progress-info">{typingContextData.progressWordsTyped}|25</div>
				{:else}
					<div style="visibility: hidden;"><TypingProgress /></div>
				{/if}

				{#if displayTimer}
					<div class="progress-info">{remainingTime}</div>
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
	</div>
{:else if competitionStatus === 'finished' || competitionStatus === 'terminated'}
	<CompeteTypingModeResult {playersData} {playerId} {restart} />
{/if}

<style>
	.progress-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-medium);
	}

	.player-progress {
		width: 100%;
		background-color: var(--secondary-color);
		border-radius: var(--border-radius);
	}

	.progress-bar {
		height: 30px;
		border-radius: var(--border-radius);
		transition: width 0.5s ease-in-out;
		background-color: var(--primary-color);
	}

	.progress-text {
		color: var(--text-color);
		height: 100%;
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		gap: var(--spacing-small);
		padding: 0 var(--spacing-small) 0 var(--spacing-small);
		font-weight: bold;
		text-wrap: nowrap;
	}

	.progress-info {
		font-size: 1.5rem;
		color: var(--accent-color);
	}
</style>
