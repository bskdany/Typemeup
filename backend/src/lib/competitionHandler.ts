import WebSocket from 'ws';
// import { generateRandomWords } from '../utils/textGenerator';

interface Player {
  socket: WebSocket;
  userId: string;
  progress: number;
  hasFinished: boolean;
  hasLeft: boolean;
}

const waitingPlayers: Player[] = [];
const activeCompetitions: Map<string, { players: Player[], hasPlayerFinished: boolean, hasCountdownFinished: boolean, timer: NodeJS.Timeout | null }> = new Map();
const PLAYERS_PER_COMPETITION = 3;

let playerCount = 0;

export function handleCompetition(socket: WebSocket) {
  let player: Player | null = null;

  socket.on('message', (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'join':
        const userId = data.userId || `Player ${++playerCount}`;
        player = { socket, userId, progress: 0, hasFinished: false, hasLeft: false };
        joinWaitingRoom(player);
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

function getCompetition(player: Player) {
  return Array.from(activeCompetitions.entries()).find(([_, comp]) =>
    comp.players.includes(player)
  );
}

function updatePlayersInCompetition(competitionId: string, message: any) {
  const competition = activeCompetitions.get(competitionId);
  if (competition) {
    competition.players.forEach(p => p.socket.send(JSON.stringify(message)));
  }
}

function joinWaitingRoom(player: Player) {
  waitingPlayers.push(player);

  if (waitingPlayers.length >= PLAYERS_PER_COMPETITION) {
    const competitionPlayers = waitingPlayers.splice(0, PLAYERS_PER_COMPETITION);
    startCompetitionCountdown(competitionPlayers);
    startCompetition(competitionPlayers);
  } else {
    for (const player of waitingPlayers) {
      player.socket.send(JSON.stringify({ type: 'waiting', playersWaiting: waitingPlayers.length, playerName: player.userId }));
    }
  }
}

function startCompetitionCountdown(players: Player[]) {
  for (const player of players) {
    player.socket.send(JSON.stringify({ type: 'startCoundown', time: 3 }));
  }
}

function startCompetition(players: Player[]) {
  // const targetText = generateRandomWords(50);
  const targetText = ['Hello', 'world'];
  const competitionId = players.map(p => p.userId).join('-');

  activeCompetitions.set(competitionId, { players, hasPlayerFinished: false, timer: null, hasCountdownFinished: false });

  const startMessage = JSON.stringify({ type: 'matchFound', targetText, players: players.map(p => p.userId) });
  players.forEach(player => player.socket.send(startMessage));

  for (const player of players) {
    player.socket.send(JSON.stringify({ type: 'startCountdown', time: 3 }));
  }

  setTimeout(() => {
    activeCompetitions.set(competitionId, { players, hasPlayerFinished: false, timer: null, hasCountdownFinished: true });
  }, 3000);
}

function updateProgress(player: Player, progress: number) {
  player.progress = progress;

  const competition = getCompetition(player);

  if (competition) {
    const [competitionId, comp] = competition;
    const progressUpdate = JSON.stringify({
      type: 'progressUpdate',
      players: comp.players.map(p => ({ userId: p.userId, progress: p.progress }))
    });
    comp.players.forEach(p => p.socket.send(progressUpdate));
  }
}

function finishCompetition(player: Player) {
  const competition = getCompetition(player);

  if (competition) {
    const [competitionId, comp] = competition;
    player.hasFinished = true;

    const rankings = comp.players.filter(p => p.hasFinished).sort((a, b) => b.progress - a.progress);
    const endMessage = JSON.stringify({
      type: 'finished',
      rankings: rankings.map((p, index) => ({ playerName: p.userId, rank: index + 1 }))
    });
    comp.players.forEach(p => {
      if (p.hasFinished) {
        p.socket.send(endMessage);
      }
    });

    // if the player does not finish the competition in 30 seconds after the first finisher, the competition is terminated
    if (!comp.hasPlayerFinished) {
      comp.hasPlayerFinished = true;

      comp.timer = setTimeout(() => {
        endCompetition(competitionId);
      }, 30000);

      const notifyOthers = JSON.stringify({ type: 'firstFinisherNotification', userId: player.userId });
      comp.players.forEach(p => {
        if (p !== player) {
          p.socket.send(notifyOthers);
        }
      });
    }
  }
}

function updateRankings(competitionId: string) {
  const competition = activeCompetitions.get(competitionId);
  if (competition) {
    const players = competition.players;
    const rankings = players.sort((a, b) => b.progress - a.progress);
    const rankingsMessage = JSON.stringify({
      type: 'rankings',
      rankings: rankings.map((p, index) => ({ userId: p.userId, rank: index + 1 }))
    });
    competition.players.forEach(p => p.socket.send(rankingsMessage));
  }
}


function endCompetition(competitionId: string) {
  const competition = activeCompetitions.get(competitionId);
  if (competition) {
    const players = competition.players;
    const rankings = players.sort((a, b) => b.progress - a.progress);
    const endMessage = JSON.stringify({
      type: 'terminated',
      rankings: rankings.map((p, index) => ({ playerName: p.userId, rank: index + 1 }))
    });
    players.filter(p => !p.hasFinished).forEach(p => p.socket.send(endMessage));
  }
}

function removePlayer(player: Player) {
  // remove player from waiting players
  const waitingIndex = waitingPlayers.findIndex(p => p === player);
  if (waitingIndex !== -1) {
    waitingPlayers.splice(waitingIndex, 1);
    // update waiting players
    const waitingMessage = JSON.stringify({ type: 'waiting', playersWaiting: waitingPlayers.length });
    waitingPlayers.forEach(p => p.socket.send(waitingMessage));
    return;
  }

  // remove player from active competitions
  // const competition = Array.from(activeCompetitions.entries()).find(([_, comp]) =>
  //   comp.players.includes(player)
  // );

  // if (competition) {
  //   const [competitionId, comp] = competition;

  //   const remainingPlayers = comp.players.filter(p => p !== player);
  //   if (remainingPlayers.length < 2) {
  //     remainingPlayers.forEach(p => p.socket.send(JSON.stringify({ type: 'terminated', reason: 'notEnoughPlayers' })));
  //     activeCompetitions.delete(competitionId);
  //   }
  // }

}