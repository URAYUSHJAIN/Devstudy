import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import problemBank from '../src/data/problem-bank.json';
import { calcElo, calcXP } from '../src/lib/elo';

type Mode = 'blitz' | 'ranked' | 'practice';
type Status = 'coding' | 'thinking' | 'submitted';
type Difficulty = 'easy' | 'medium' | 'hard';

type QueuePlayer = {
  userId: string;
  rating: number;
  mode: Mode;
  socketId: string;
  joinedAt: number;
  name: string;
  avatar: string;
};

type LobbyFighter = {
  userId: string;
  name: string;
  rating: number;
  mode: Mode;
  avatar: string;
  joinedAt: number;
};

type RoomPlayer = {
  userId: string;
  rating: number;
  socketId: string;
  name: string;
  avatar: string;
  linesWritten: number;
  testsPassed: number;
  status: Status;
  submittedAt?: number;
  submission?: {
    code: string;
    language: string;
    timeTaken: number;
  };
};

type Question = {
  id: string;
  title: string;
  description: string;
  examples: string[];
  constraints: string;
  difficulty: Difficulty;
  source: 'leetcode' | 'codechef';
  timeLimit: string;
};

type BattleRoom = {
  roomId: string;
  mode: Mode;
  question: Question;
  players: Record<string, RoomPlayer>;
  createdAt: number;
  totalSeconds: number | null;
  secondsRemaining: number | null;
  ticker?: NodeJS.Timeout;
  syncEmitter?: NodeJS.Timeout;
  rematchRequests: Set<string>;
  resolved: boolean;
};

const PORT = 3001;
const queues: Record<Mode, QueuePlayer[]> = {
  blitz: [],
  ranked: [],
  practice: [],
};
const userSocketMap = new Map<string, string>();
const privateRoomHosts = new Map<string, QueuePlayer>();
const battleRooms = new Map<string, BattleRoom>();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || '*';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
});

function getLobbyFighters(limit = 18): LobbyFighter[] {
  const fighters = (Object.keys(queues) as Mode[])
    .flatMap((mode) => queues[mode].map((p) => ({
      userId: p.userId,
      name: p.name,
      rating: p.rating,
      mode,
      avatar: p.avatar,
      joinedAt: p.joinedAt,
    })));

  return fighters
    .sort((a, b) => a.joinedAt - b.joinedAt)
    .slice(0, limit);
}

function emitLobbyStats() {
  const queued = (Object.keys(queues) as Mode[]).reduce((sum, mode) => sum + queues[mode].length, 0);
  io.emit('lobby_stats', {
    online: io.engine.clientsCount,
    queued,
    queuedByMode: {
      blitz: queues.blitz.length,
      ranked: queues.ranked.length,
      practice: queues.practice.length,
    },
    fighters: getLobbyFighters(),
  });
}

function randomAvatar(seed: string): string {
  const safeSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/8.x/thumbs/svg?seed=${safeSeed}`;
}

function pickQuestion(mode: Mode): Question {
  const difficulties: Difficulty[] = mode === 'ranked' ? ['medium', 'hard'] : mode === 'blitz' ? ['easy', 'medium'] : ['easy', 'medium', 'hard'];
  const candidates = problemBank.filter((q) => difficulties.includes(q.difficulty as Difficulty));
  const source = Math.random() > 0.5 ? 'leetcode' : 'codechef';
  const sourceCandidates = candidates.filter((q) => q.source === source);
  const picked = (sourceCandidates.length > 0 ? sourceCandidates : candidates)[Math.floor(Math.random() * (sourceCandidates.length > 0 ? sourceCandidates.length : candidates.length))];

  return {
    id: picked.id,
    title: picked.title,
    description: picked.description,
    examples: picked.examples,
    constraints: picked.constraints,
    difficulty: picked.difficulty as Difficulty,
    source: picked.source as 'leetcode' | 'codechef',
    timeLimit: picked.timeLimit,
  };
}

function getTotalSeconds(mode: Mode): number | null {
  if (mode === 'ranked') return 25 * 60;
  if (mode === 'blitz') return 5 * 60;
  return null;
}

function cleanupPlayer(socketId: string) {
  for (const [userId, mappedSocketId] of userSocketMap.entries()) {
    if (mappedSocketId === socketId) {
      userSocketMap.delete(userId);
    }
  }

  for (const mode of Object.keys(queues) as Mode[]) {
    queues[mode] = queues[mode].filter((p) => p.socketId !== socketId);
  }

  for (const [code, host] of privateRoomHosts.entries()) {
    if (host.socketId === socketId) {
      privateRoomHosts.delete(code);
    }
  }

  emitLobbyStats();
}

function removeSocketFromAllQueues(socketId: string): boolean {
  let removed = false;
  for (const mode of Object.keys(queues) as Mode[]) {
    const before = queues[mode].length;
    queues[mode] = queues[mode].filter((p) => p.socketId !== socketId);
    if (queues[mode].length !== before) {
      removed = true;
    }
  }
  return removed;
}

function startRoomTimers(room: BattleRoom) {
  if (room.totalSeconds === null || room.secondsRemaining === null) {
    return;
  }

  room.ticker = setInterval(() => {
    if (room.resolved) {
      return;
    }

    if (room.secondsRemaining === null) {
      return;
    }

    room.secondsRemaining -= 1;

    if (room.secondsRemaining <= 0) {
      room.secondsRemaining = 0;
      resolveBattle(room.roomId, 'timer-expired');
    }
  }, 1000);

  room.syncEmitter = setInterval(() => {
    if (room.resolved) {
      return;
    }

    io.to(room.roomId).emit('timer_sync', { secondsRemaining: room.secondsRemaining });
  }, 5000);
}

function clearRoomTimers(room: BattleRoom) {
  if (room.ticker) {
    clearInterval(room.ticker);
  }
  if (room.syncEmitter) {
    clearInterval(room.syncEmitter);
  }
}

function decideWinner(room: BattleRoom, reason: 'both-submitted' | 'timer-expired') {
  const players = Object.values(room.players);
  const [a, b] = players;

  const aTests = a.testsPassed;
  const bTests = b.testsPassed;
  if (aTests !== bTests) {
    return aTests > bTests ? [a, b] : [b, a];
  }

  if (reason === 'timer-expired') {
    if (a.linesWritten !== b.linesWritten) {
      return a.linesWritten > b.linesWritten ? [a, b] : [b, a];
    }
    return [a, b];
  }

  const aTime = a.submission?.timeTaken ?? Number.MAX_SAFE_INTEGER;
  const bTime = b.submission?.timeTaken ?? Number.MAX_SAFE_INTEGER;
  if (aTime !== bTime) {
    return aTime < bTime ? [a, b] : [b, a];
  }

  const aLen = a.submission?.code.length ?? Number.MAX_SAFE_INTEGER;
  const bLen = b.submission?.code.length ?? Number.MAX_SAFE_INTEGER;
  if (aLen !== bLen) {
    return aLen < bLen ? [a, b] : [b, a];
  }

  return [a, b];
}

function resolveBattle(roomId: string, reason: 'both-submitted' | 'timer-expired') {
  const room = battleRooms.get(roomId);
  if (!room || room.resolved) {
    return;
  }

  room.resolved = true;
  clearRoomTimers(room);

  const [winner, loser] = decideWinner(room, reason);
  const winnerDelta = calcElo(winner.rating, loser.rating, true);
  const loserDelta = calcElo(loser.rating, winner.rating, false);
  const winnerXP = calcXP(true, winner.submission?.timeTaken ?? 0, room.totalSeconds ?? Math.max((winner.submission?.timeTaken ?? 1), 1), room.question.difficulty);
  const loserXP = calcXP(false, loser.submission?.timeTaken ?? 0, room.totalSeconds ?? Math.max((loser.submission?.timeTaken ?? 1), 1), room.question.difficulty);

  const payload = {
    winner: {
      userId: winner.userId,
      name: winner.name,
      rating: winner.rating,
      testsPassed: winner.testsPassed,
      timeTaken: winner.submission?.timeTaken ?? null,
      codeLength: winner.submission?.code.length ?? null,
    },
    loser: {
      userId: loser.userId,
      name: loser.name,
      rating: loser.rating,
      testsPassed: loser.testsPassed,
      timeTaken: loser.submission?.timeTaken ?? null,
      codeLength: loser.submission?.code.length ?? null,
    },
    timeDiff:
      (loser.submission?.timeTaken ?? room.totalSeconds ?? 0) -
      (winner.submission?.timeTaken ?? room.totalSeconds ?? 0),
    eloChange: {
      [winner.userId]: winnerDelta,
      [loser.userId]: loserDelta,
    },
    xpGained: {
      [winner.userId]: winnerXP,
      [loser.userId]: loserXP,
    },
    solutionComparison: {
      [winner.userId]: {
        language: winner.submission?.language ?? null,
        codeLength: winner.submission?.code.length ?? null,
        testsPassed: winner.testsPassed,
      },
      [loser.userId]: {
        language: loser.submission?.language ?? null,
        codeLength: loser.submission?.code.length ?? null,
        testsPassed: loser.testsPassed,
      },
    },
    reason,
  };

  io.to(roomId).emit('battle_result', payload);
}

function makeBattleRoom(mode: Mode, p1: QueuePlayer, p2: QueuePlayer) {
  const roomId = uuidv4();
  const totalSeconds = getTotalSeconds(mode);
  const question = pickQuestion(mode);

  const room: BattleRoom = {
    roomId,
    mode,
    question,
    createdAt: Date.now(),
    totalSeconds,
    secondsRemaining: totalSeconds,
    rematchRequests: new Set<string>(),
    resolved: false,
    players: {
      [p1.userId]: {
        userId: p1.userId,
        rating: p1.rating,
        socketId: p1.socketId,
        name: p1.name,
        avatar: p1.avatar,
        linesWritten: 0,
        testsPassed: 0,
        status: 'thinking',
      },
      [p2.userId]: {
        userId: p2.userId,
        rating: p2.rating,
        socketId: p2.socketId,
        name: p2.name,
        avatar: p2.avatar,
        linesWritten: 0,
        testsPassed: 0,
        status: 'thinking',
      },
    },
  };

  battleRooms.set(roomId, room);

  const s1 = io.sockets.sockets.get(p1.socketId);
  const s2 = io.sockets.sockets.get(p2.socketId);
  s1?.join(roomId);
  s2?.join(roomId);

  io.to(p1.socketId).emit('match_found', {
    roomId,
    opponent: { name: p2.name, rating: p2.rating, avatar: p2.avatar, userId: p2.userId },
    question,
  });

  io.to(p2.socketId).emit('match_found', {
    roomId,
    opponent: { name: p1.name, rating: p1.rating, avatar: p1.avatar, userId: p1.userId },
    question,
  });

  startRoomTimers(room);
}

function tryMatchmaking(mode: Mode) {
  const queue = queues[mode];
  if (queue.length < 2) {
    return;
  }

  queue.sort((a, b) => a.joinedAt - b.joinedAt);

  let matched = false;
  let i = 0;
  while (i < queue.length - 1) {
    const player = queue[i];
    const waitedMs = Date.now() - player.joinedAt;
    const threshold = waitedMs >= 30_000 ? 500 : 200;

    let matchIndex = -1;
    for (let j = i + 1; j < queue.length; j += 1) {
      const candidate = queue[j];
      if (Math.abs(candidate.rating - player.rating) <= threshold) {
        matchIndex = j;
        break;
      }
    }

    if (matchIndex === -1) {
      i += 1;
      continue;
    }

    const opponent = queue[matchIndex];
    queue.splice(matchIndex, 1);
    queue.splice(i, 1);
    makeBattleRoom(mode, player, opponent);
    matched = true;
  }

  if (matched) {
    emitLobbyStats();
  }
}

io.on('connection', (socket) => {
  socket.on('join_lobby', (payload: { userId: string; rating: number; mode: Mode; name?: string; avatar?: string }) => {
    removeSocketFromAllQueues(socket.id);

    const safeName = payload.name?.trim() || `Player ${payload.userId.slice(0, 4)}`;
    const player: QueuePlayer = {
      userId: payload.userId,
      rating: payload.rating,
      mode: payload.mode,
      socketId: socket.id,
      joinedAt: Date.now(),
      name: safeName.slice(0, 32),
      avatar: payload.avatar || randomAvatar(payload.userId),
    };

    userSocketMap.set(payload.userId, socket.id);
    queues[payload.mode].push(player);
    emitLobbyStats();
    tryMatchmaking(payload.mode);
  });

  socket.on('create_private', (payload: { userId: string; roomCode: string; rating?: number }) => {
    privateRoomHosts.set(payload.roomCode, {
      userId: payload.userId,
      rating: payload.rating ?? 1200,
      mode: 'practice',
      socketId: socket.id,
      joinedAt: Date.now(),
      name: `Player ${payload.userId.slice(0, 4)}`,
      avatar: randomAvatar(payload.userId),
    });

    socket.join(payload.roomCode);
    emitLobbyStats();
  });

  socket.on('join_private', (payload: { userId: string; roomCode: string; rating?: number }) => {
    const host = privateRoomHosts.get(payload.roomCode);
    if (!host) {
      socket.emit('match_found', { error: 'Private room not found' });
      return;
    }

    const guest: QueuePlayer = {
      userId: payload.userId,
      rating: payload.rating ?? 1200,
      mode: 'practice',
      socketId: socket.id,
      joinedAt: Date.now(),
      name: `Player ${payload.userId.slice(0, 4)}`,
      avatar: randomAvatar(payload.userId),
    };

    privateRoomHosts.delete(payload.roomCode);
    makeBattleRoom('practice', host, guest);
    emitLobbyStats();
  });

  socket.on('code_update', (payload: { roomId: string; userId: string; linesWritten: number; testsPassed: number }) => {
    const room = battleRooms.get(payload.roomId);
    const player = room?.players[payload.userId];

    if (!room || !player || room.resolved) {
      return;
    }

    player.linesWritten = payload.linesWritten;
    player.testsPassed = payload.testsPassed;
    player.status = 'coding';

    socket.to(payload.roomId).emit('opponent_update', {
      linesWritten: payload.linesWritten,
      testsPassed: payload.testsPassed,
      status: player.status,
    });
  });

  socket.on('submit_solution', (payload: { roomId: string; userId: string; code: string; language: string; timeTaken: number; testsPassed?: number }) => {
    const room = battleRooms.get(payload.roomId);
    const player = room?.players[payload.userId];

    if (!room || !player || room.resolved) {
      return;
    }

    player.submission = {
      code: payload.code,
      language: payload.language,
      timeTaken: payload.timeTaken,
    };

    if (typeof payload.testsPassed === 'number') {
      player.testsPassed = payload.testsPassed;
    }

    player.status = 'submitted';
    player.submittedAt = Date.now();

    socket.to(payload.roomId).emit('opponent_update', {
      linesWritten: player.linesWritten,
      testsPassed: player.testsPassed,
      status: player.status,
    });

    const players = Object.values(room.players);
    if (players.every((p) => p.status === 'submitted')) {
      resolveBattle(payload.roomId, 'both-submitted');
    }
  });

  socket.on('rematch_request', (payload: { roomId: string; userId: string }) => {
    const room = battleRooms.get(payload.roomId);
    if (!room) {
      return;
    }

    room.rematchRequests.add(payload.userId);

    if (room.rematchRequests.size < 2) {
      return;
    }

    const players = Object.values(room.players);
    const [a, b] = players;
    const newRoomId = uuidv4();
    const question = pickQuestion(room.mode);
    const totalSeconds = getTotalSeconds(room.mode);

    const newRoom: BattleRoom = {
      roomId: newRoomId,
      mode: room.mode,
      question,
      createdAt: Date.now(),
      totalSeconds,
      secondsRemaining: totalSeconds,
      rematchRequests: new Set<string>(),
      resolved: false,
      players: {
        [a.userId]: {
          ...a,
          linesWritten: 0,
          testsPassed: 0,
          status: 'thinking',
          submission: undefined,
          submittedAt: undefined,
        },
        [b.userId]: {
          ...b,
          linesWritten: 0,
          testsPassed: 0,
          status: 'thinking',
          submission: undefined,
          submittedAt: undefined,
        },
      },
    };

    battleRooms.set(newRoomId, newRoom);

    io.sockets.sockets.get(a.socketId)?.join(newRoomId);
    io.sockets.sockets.get(b.socketId)?.join(newRoomId);

    io.to(payload.roomId).emit('rematch_accepted', {
      newRoomId,
      newQuestion: question,
    });

    startRoomTimers(newRoom);
  });

  socket.on('disconnect', () => {
    cleanupPlayer(socket.id);

    for (const room of battleRooms.values()) {
      const disconnected = Object.values(room.players).find((p) => p.socketId === socket.id);
      if (!disconnected || room.resolved) {
        continue;
      }

      const opponent = Object.values(room.players).find((p) => p.socketId !== socket.id);
      if (!opponent) {
        continue;
      }

      disconnected.status = 'submitted';
      disconnected.submission = disconnected.submission ?? {
        code: '',
        language: 'unknown',
        timeTaken: room.totalSeconds ?? 0,
      };
      disconnected.testsPassed = 0;

      opponent.status = opponent.status === 'submitted' ? 'submitted' : 'coding';
      resolveBattle(room.roomId, 'timer-expired');
    }

    emitLobbyStats();
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server listening on http://localhost:${PORT}`);
});
