import WebSocket from 'ws';
// import { generateRandomWords } from '../utils/textGenerator';

interface Player {
  socket: WebSocket;
  userId: string;
  progress: number;
}

const waitingPlayers: Player[] = [];
const activeCompetitions: Map<string, Player[]> = new Map();
const PLAYERS_PER_COMPETITION = 2;

export function handleCompetition(socket: WebSocket) {
  let player: Player | null = null;

  socket.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'join':
        player = { socket, userId: data.userId || 'Anonymous', progress: 0 };
        joinCompetition(player);
        break;
      case 'progress':
        if (player) {
          updateProgress(player, data.progress);
        }
        break;
      case 'finished':
        if (player) {
          finishCompetition(player);
        }
        break;
    }
  });

  socket.on('close', () => {
    if (player) {
      removePlayer(player);
    }
  });
}

function joinCompetition(player: Player) {
  waitingPlayers.push(player);

  console.log('waitingPlayers', waitingPlayers);

  if (waitingPlayers.length >= PLAYERS_PER_COMPETITION) {
    const competitionPlayers = waitingPlayers.splice(0, PLAYERS_PER_COMPETITION);
    startCompetition(competitionPlayers);
  } else {
    player.socket.send(JSON.stringify({ type: 'waiting', playersWaiting: waitingPlayers.length }));
  }
}

function startCompetition(players: Player[]) {
  // const targetText = generateRandomWords(50);
  const targetText = ['Hello', 'world'];
  const competitionId = players.map(p => p.userId).join('-');

  activeCompetitions.set(competitionId, players);

  const startMessage = JSON.stringify({ type: 'matchFound', targetText, players: players.map(p => p.userId) });
  players.forEach(player => player.socket.send(startMessage));
}

function updateProgress(player: Player, progress: number) {
  player.progress = progress;

  const competition = Array.from(activeCompetitions.entries()).find(([_, players]) =>
    players.includes(player)
  );

  if (competition) {
    const [competitionId, players] = competition;
    const progressUpdate = JSON.stringify({
      type: 'progressUpdate',
      players: players.map(p => ({ userId: p.userId, progress: p.progress }))
    });
    players.forEach(p => p.socket.send(progressUpdate));
  }
}

function finishCompetition(player: Player) {
  const competition = Array.from(activeCompetitions.entries()).find(([_, players]) =>
    players.includes(player)
  );

  if (competition) {
    const [competitionId, players] = competition;
    const rankings = players.sort((a, b) => b.progress - a.progress);
    const endMessage = JSON.stringify({
      type: 'competitionEnd',
      rankings: rankings.map((p, index) => ({ userId: p.userId, rank: index + 1 }))
    });
    players.forEach(p => p.socket.send(endMessage));
    activeCompetitions.delete(competitionId);
  }
}

function removePlayer(player: Player) {
  const waitingIndex = waitingPlayers.findIndex(p => p === player);
  if (waitingIndex !== -1) {
    waitingPlayers.splice(waitingIndex, 1);
    return;
  }

  const competition = Array.from(activeCompetitions.entries()).find(([_, players]) =>
    players.includes(player)
  );

  if (competition) {
    const [competitionId, players] = competition;
    const remainingPlayers = players.filter(p => p !== player);
    if (remainingPlayers.length < 2) {
      remainingPlayers.forEach(p => p.socket.send(JSON.stringify({ type: 'competitionEnd', reason: 'notEnoughPlayers' })));
      activeCompetitions.delete(competitionId);
    } else {
      activeCompetitions.set(competitionId, remainingPlayers);
      const disconnectMessage = JSON.stringify({ type: 'playerDisconnected', userId: player.userId });
      remainingPlayers.forEach(p => p.socket.send(disconnectMessage));
    }
  }
}