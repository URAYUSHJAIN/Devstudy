'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  CheckCircle2,
  Crown,
  Flame,
  Radio,
  Timer,
  Trophy,
  User,
  Users,
} from 'lucide-react';
import { useSocket, useSocketConnectionStatus } from '@/lib/socket';
import { signIn, useSession } from 'next-auth/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Mode = 'blitz' | 'ranked' | 'practice';
type Difficulty = 'easy' | 'medium' | 'hard';
type Status = 'coding' | 'thinking' | 'submitted';

type ArenaQuestion = {
  id: string;
  title: string;
  description: string;
  examples: string[];
  constraints: string;
  difficulty: Difficulty;
  source: 'leetcode' | 'codechef';
  timeLimit: string;
};

type Opponent = {
  userId: string;
  name: string;
  rating: number;
  avatar: string;
};

type BattleResult = {
  winner: {
    userId: string;
    name: string;
    testsPassed: number;
    timeTaken: number | null;
    codeLength: number | null;
  };
  loser: {
    userId: string;
    name: string;
    testsPassed: number;
    timeTaken: number | null;
    codeLength: number | null;
  };
  eloChange: Record<string, number>;
  xpGained: Record<string, number>;
  timeDiff: number;
};

type LobbyFighter = {
  userId: string;
  name: string;
  rating: number;
  mode: Mode;
  avatar: string;
};

function avatarInitial(name: string | undefined): string {
  if (!name) return 'OP';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function statusClass(status: Status) {
  if (status === 'submitted') return 'bg-[#6f87ff]/20 text-[#cfd9ff] border-[#6f87ff]/30';
  if (status === 'coding') return 'bg-[#71C9CE]/20 text-[#cbf9fb] border-[#71C9CE]/30';
  return 'bg-[#f6b73c]/20 text-[#ffe4b3] border-[#f6b73c]/30';
}

function getInitialProfile(): { elo: number; streak: number; userId: string } {
  if (typeof window === 'undefined') {
    return { elo: 1200, streak: 0, userId: '' };
  }

  const existing = localStorage.getItem('ds_profile');
  if (!existing) {
    return { elo: 1200, streak: 0, userId: `u-${crypto.randomUUID().slice(0, 8)}` };
  }

  try {
    const parsed = JSON.parse(existing) as { elo?: number; streak?: number; userId?: string };
    return {
      elo: parsed.elo ?? 1200,
      streak: parsed.streak ?? 0,
      userId: parsed.userId ?? `u-${crypto.randomUUID().slice(0, 8)}`,
    };
  } catch {
    return { elo: 1200, streak: 0, userId: `u-${crypto.randomUUID().slice(0, 8)}` };
  }
}

const BattleArena = () => {
  const [initialProfile] = useState(getInitialProfile);
  const socket = useSocket();
  const connected = useSocketConnectionStatus();
  const { data: session, status: sessionStatus } = useSession();

  const [mode, setMode] = useState<Mode>('ranked');
  const [roomId, setRoomId] = useState<string>('lobby');
  const [question, setQuestion] = useState<ArenaQuestion | null>(null);
  const [code, setCode] = useState('// Waiting for match...');
  const [language] = useState('javascript');
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [myStatus, setMyStatus] = useState<Status>('thinking');
  const [opponentStatus, setOpponentStatus] = useState<Status>('thinking');
  const [myTests, setMyTests] = useState(0);
  const [opponentLines, setOpponentLines] = useState(0);
  const [opponentTests, setOpponentTests] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [totalSeconds, setTotalSeconds] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [queuedTotal, setQueuedTotal] = useState(0);
  const [queuedByMode, setQueuedByMode] = useState<Record<Mode, number>>({ blitz: 0, ranked: 0, practice: 0 });
  const [availableFighters, setAvailableFighters] = useState<LobbyFighter[]>([]);
  const [avgWait] = useState(18);
  const [myElo, setMyElo] = useState(initialProfile.elo);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [userId] = useState(initialProfile.userId);
  const [sessionWaitExpired, setSessionWaitExpired] = useState(false);
  const effectiveUserId = session?.user?.id || userId;
  const effectiveUserName = session?.user?.name?.trim() || `Player ${effectiveUserId.slice(0, 4)}`;
  const effectiveAvatar = session?.user?.image || undefined;

  const emitDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetLobbyState = (selectedMode: Mode) => {
    setRoomId('lobby');
    setQuestion(null);
    setOpponent(null);
    setMyStatus('thinking');
    setOpponentStatus('thinking');
    setMyTests(0);
    setOpponentTests(0);
    setOpponentLines(0);
    setSecondsRemaining(selectedMode === 'ranked' ? 25 * 60 : selectedMode === 'blitz' ? 5 * 60 : null);
    setTotalSeconds(selectedMode === 'ranked' ? 25 * 60 : selectedMode === 'blitz' ? 5 * 60 : null);
    setResult(null);
  };

  const queueForMode = useCallback((selectedMode: Mode, rating = myElo) => {
    if (!connected || !effectiveUserId || !session?.user) return;
    socket.emit('join_lobby', {
      userId: effectiveUserId,
      rating,
      mode: selectedMode,
      name: effectiveUserName,
      avatar: effectiveAvatar,
    });
  }, [connected, myElo, socket, effectiveUserId, effectiveUserName, effectiveAvatar, session?.user]);

  useEffect(() => {
    queueForMode(mode, myElo);
  }, [mode, myElo, queueForMode]);

  const handleModeSelect = (nextMode: Mode) => {
    setMode(nextMode);
    resetLobbyState(nextMode);
    queueForMode(nextMode);
  };

  useEffect(() => {
    const onMatchFound = (payload: { roomId?: string; opponent?: Opponent; question?: ArenaQuestion }) => {
      if (!payload.roomId || !payload.question || !payload.opponent) {
        return;
      }

      setRoomId(payload.roomId);
      setQuestion(payload.question);
      setOpponent(payload.opponent);
      setCode('// Start coding here...');
      setMyStatus('coding');
      setOpponentStatus('thinking');
      setMyTests(0);
      setOpponentTests(0);
      setOpponentLines(0);
      setTotalSeconds(mode === 'ranked' ? 25 * 60 : mode === 'blitz' ? 5 * 60 : null);
      setSecondsRemaining(mode === 'ranked' ? 25 * 60 : mode === 'blitz' ? 5 * 60 : null);
      setResult(null);
    };

    const onOpponentUpdate = (payload: { linesWritten: number; testsPassed: number; status: Status }) => {
      setOpponentLines(payload.linesWritten);
      setOpponentTests(payload.testsPassed);
      setOpponentStatus(payload.status);
    };

    const onBattleResult = (payload: BattleResult) => {
      setMyStatus('submitted');
      setOpponentStatus('submitted');
      setResult(payload);
      const delta = payload.eloChange[effectiveUserId] ?? 0;
      setMyElo((prev) => prev + delta);
    };

    const onTimerSync = (payload: { secondsRemaining: number }) => {
      setSecondsRemaining(payload.secondsRemaining);
    };

    const onRematchAccepted = (payload: { newRoomId: string; newQuestion: ArenaQuestion }) => {
      setRoomId(payload.newRoomId);
      setQuestion(payload.newQuestion);
      setCode('// Rematch started...');
      setMyStatus('coding');
      setOpponentStatus('thinking');
      setMyTests(0);
      setOpponentTests(0);
      setOpponentLines(0);
      setResult(null);
    };

    const onLobbyStats = (payload: { online: number; queued?: number; queuedByMode?: Partial<Record<Mode, number>>; fighters?: LobbyFighter[] }) => {
      setOnlineCount(payload.online);
      setQueuedTotal(payload.queued ?? 0);
      setQueuedByMode({
        blitz: payload.queuedByMode?.blitz ?? 0,
        ranked: payload.queuedByMode?.ranked ?? 0,
        practice: payload.queuedByMode?.practice ?? 0,
      });
      setAvailableFighters((payload.fighters ?? []).filter((f) => f.userId !== effectiveUserId));
    };

    socket.on('match_found', onMatchFound);
    socket.on('opponent_update', onOpponentUpdate);
    socket.on('battle_result', onBattleResult);
    socket.on('timer_sync', onTimerSync);
    socket.on('rematch_accepted', onRematchAccepted);
    socket.on('lobby_stats', onLobbyStats);

    return () => {
      socket.off('match_found', onMatchFound);
      socket.off('opponent_update', onOpponentUpdate);
      socket.off('battle_result', onBattleResult);
      socket.off('timer_sync', onTimerSync);
      socket.off('rematch_accepted', onRematchAccepted);
      socket.off('lobby_stats', onLobbyStats);
    };
  }, [mode, socket, effectiveUserId]);

  const elapsed = useMemo(() => {
    if (totalSeconds !== null && secondsRemaining !== null) {
      return Math.max(totalSeconds - secondsRemaining, 0);
    }
    return 0;
  }, [secondsRemaining, totalSeconds]);

  const total = totalSeconds ?? 1;
  const progress = secondsRemaining === null ? 1 : clamp(secondsRemaining / total, 0, 1);
  const timerColorClass = progress > 0.25 ? 'text-[#71C9CE]' : progress > 0.1 ? 'text-[#f6b73c]' : 'text-[#ef4444]';
  const timerProgressClass = progress > 0.25 ? 'battle-progress-cyan' : progress > 0.1 ? 'battle-progress-amber' : 'battle-progress-red';

  const sendCodeUpdate = (nextCode: string) => {
    if (roomId === 'lobby') return;

    const lines = nextCode.split('\n').filter((line) => line.trim().length > 0).length;
    const pseudoTests = clamp(Math.floor(lines / 12), 0, 5);
    setMyTests(pseudoTests);
    setMyStatus('coding');

    if (emitDebounceRef.current) {
      clearTimeout(emitDebounceRef.current);
    }

    emitDebounceRef.current = setTimeout(() => {
      socket.emit('code_update', {
        roomId,
        userId,
        linesWritten: lines,
        testsPassed: pseudoTests,
      });
    }, 2000);
  };

  const handleSubmit = () => {
    if (roomId === 'lobby') {
      return;
    }

    const timeTaken = totalSeconds
      ? totalSeconds - (secondsRemaining ?? 0)
      : elapsed;

    socket.emit('submit_solution', {
      roomId,
      userId: effectiveUserId,
      code,
      language,
      timeTaken,
      testsPassed: myTests,
    });

    setMyStatus('submitted');
  };

  const requestRematch = () => {
    socket.emit('rematch_request', {
      roomId,
      userId: effectiveUserId,
    });
  };

  useEffect(() => {
    if (sessionStatus !== 'loading') {
      setSessionWaitExpired(false);
      return;
    }

    const timeout = setTimeout(() => {
      setSessionWaitExpired(true);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [sessionStatus]);

  if (sessionStatus === 'loading' && !sessionWaitExpired) {
    return <div className="min-h-screen pt-28 px-4 text-center text-[#2a6264]">Loading battle arena...</div>;
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen pt-28 px-4">
        <div className="max-w-xl mx-auto rounded-2xl border border-[#71C9CE]/35 bg-white/90 p-8 text-center shadow-[0_10px_28px_rgba(16,48,49,0.08)]">
          <h1 className="text-2xl font-bold text-[#123b3d]">Sign in with GitHub to Join Live Battles</h1>
          <p className="mt-2 text-[#3d6b6d]">Battle matchmaking needs your GitHub identity so other players can see who is available to fight.</p>
          {sessionWaitExpired && (
            <p className="mt-2 text-sm text-amber-700">Session check took too long. You can sign in now or refresh this page.</p>
          )}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button onClick={() => signIn('github')} className="px-5 py-3 rounded-xl bg-[#0D2B2C] text-white font-semibold">
              Sign In with GitHub
            </button>
            <button onClick={() => window.location.reload()} className="px-5 py-3 rounded-xl border border-[#71C9CE]/45 text-[#1f5c5f] font-semibold">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(120%_120%_at_50%_0%,#e7f7f7_0%,#f8fbfb_52%,#edf5f5_100%)] text-[#103031] p-4 pt-24 md:p-6 md:pt-28">
      <style>{`
        @keyframes pulseLive { 0%,100% { opacity: .7; } 50% { opacity: 1; } }
        @keyframes timerShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-1px);} 75% { transform: translateX(1px);} }
        @keyframes crownPop { 0% { transform: scale(.5) rotate(-10deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        .pulse-live { animation: pulseLive 1.1s infinite; }
        .timer-shake { animation: timerShake .25s infinite; }
        .crown-pop { animation: crownPop .6s ease forwards; }
        .battle-progress { width: 100%; height: 100%; border: 0; }
        .battle-progress::-webkit-progress-bar { background: transparent; border-radius: 999px; }
        .battle-progress::-moz-progress-bar { border-radius: 999px; }
        .battle-progress-cyan::-webkit-progress-value { background: #71C9CE; border-radius: 999px; }
        .battle-progress-cyan::-moz-progress-bar { background: #71C9CE; }
        .battle-progress-amber::-webkit-progress-value { background: #f6b73c; border-radius: 999px; }
        .battle-progress-amber::-moz-progress-bar { background: #f6b73c; }
        .battle-progress-red::-webkit-progress-value { background: #ef4444; border-radius: 999px; }
        .battle-progress-red::-moz-progress-bar { background: #ef4444; }
      `}</style>

      <div className="max-w-350 mx-auto space-y-4">
        <header className="rounded-2xl border border-[#71C9CE]/35 bg-white/85 p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 shadow-[0_10px_28px_rgba(16,48,49,0.08)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-300/50 bg-red-50 text-red-700 text-xs font-semibold">
              <Radio className="w-3 h-3 pulse-live" />
              LIVE
            </span>
            <span className="text-sm text-[#346768]">Room: {roomId}</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${connected ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-amber-700 border-amber-300 bg-amber-50'}`}>
              {connected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#71C9CE]/15 text-[#21585a] border border-[#71C9CE]/35">LeetCode</span>
            <span className="px-3 py-1 rounded-full bg-[#f6b73c]/15 text-[#6f4e16] border border-[#f6b73c]/35">CodeChef</span>
          </div>
        </header>

        <section className="rounded-2xl border border-[#71C9CE]/30 bg-white/80 p-4 shadow-[0_8px_24px_rgba(16,48,49,0.06)]">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.6px] text-[#123b3d]">Live Code Battle Arena</h1>
          <p className="mt-2 text-sm text-[#3d6b6d]">Pick a mode, wait for a match, code your solution, and submit before time runs out.</p>
          <div className="mt-3 grid sm:grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-[#71C9CE]/25 bg-[#71C9CE]/10 px-3 py-2"><CheckCircle2 className="w-4 h-4 inline mr-1" />Mode selects timer + difficulty.</div>
            <div className="rounded-xl border border-[#71C9CE]/25 bg-[#71C9CE]/10 px-3 py-2"><CheckCircle2 className="w-4 h-4 inline mr-1" />Your progress syncs every 2s.</div>
            <div className="rounded-xl border border-[#71C9CE]/25 bg-[#71C9CE]/10 px-3 py-2"><CheckCircle2 className="w-4 h-4 inline mr-1" />Winner by tests, then time/lines.</div>
          </div>
        </section>

        <div className="rounded-xl border border-[#71C9CE]/30 bg-white/80 p-2 flex flex-wrap gap-2">
          {([
            { key: 'ranked', label: '⚔️ Ranked Battle' },
            { key: 'blitz', label: '⚡ Blitz (5min)' },
            { key: 'practice', label: '🎯 Practice' },
          ] as Array<{ key: Mode; label: string }>).map((item, idx) => (
            <button
              key={`${item.label}-${idx}`}
              onClick={() => handleModeSelect(item.key)}
              className={`px-4 py-2 rounded-full text-sm border ${
                mode === item.key
                  ? 'bg-[#71C9CE]/30 border-[#71C9CE]/60 text-[#0f3f41]'
                  : 'bg-white border-[#71C9CE]/25 text-[#2a6264]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-3 text-sm text-[#1d5356]"><Users className="w-4 h-4 inline mr-2" />Players Online: <strong>{onlineCount}</strong></div>
          <div className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-3 text-sm text-[#1d5356]"><Timer className="w-4 h-4 inline mr-2" />Avg Wait: <strong>{avgWait}s</strong></div>
          <div className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-3 text-sm text-[#1d5356]"><Trophy className="w-4 h-4 inline mr-2" />Your ELO: <strong>{myElo}</strong></div>
          <div className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-3 text-sm text-[#1d5356]"><Flame className="w-4 h-4 inline mr-2" />Queued: <strong>{queuedTotal}</strong></div>
        </div>

        <section className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-[#214f51]">Available Fighters</h2>
            <p className="text-xs text-[#4b7a7c]">Ranked {queuedByMode.ranked} • Blitz {queuedByMode.blitz} • Practice {queuedByMode.practice}</p>
          </div>
          {availableFighters.length === 0 ? (
            <p className="text-sm text-[#5b8385]">No one else is waiting right now. Stay queued and matchmaking will auto-start.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {availableFighters.map((fighter) => (
                <div key={`${fighter.userId}-${fighter.mode}`} className="rounded-lg border border-[#71C9CE]/25 bg-[#f4fbfb] p-2.5 flex items-center gap-2">
                  <Image src={fighter.avatar} alt={fighter.name} width={32} height={32} className="w-8 h-8 rounded-full border border-[#71C9CE]/35" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-[#1b4a4d]">{fighter.name}</p>
                    <p className="text-xs text-[#5b8385]">ELO {fighter.rating} • {fighter.mode}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="rounded-xl border border-[#71C9CE]/30 bg-white/90 p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="h-2 rounded-full bg-[#d7eded] overflow-hidden">
            <progress className={`battle-progress ${timerProgressClass}`} value={secondsRemaining ?? total} max={total} />
          </div>
          <div className={`text-[28px] font-mono tracking-tight ${timerColorClass} ${secondsRemaining !== null && secondsRemaining < 60 ? 'timer-shake' : ''}`}>
            {secondsRemaining === null ? '∞' : `${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, '0')}`}
          </div>
          <div className="h-2 rounded-full bg-[#d7eded] overflow-hidden">
            <progress className={`battle-progress ${timerProgressClass}`} value={secondsRemaining ?? total} max={total} />
          </div>
        </div>

        <section className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs bg-[#71C9CE]/20 border border-[#71C9CE]/30 uppercase">{question?.source ?? 'source'}</span>
            <span className={`px-3 py-1 rounded-full text-xs border ${
              (question?.difficulty ?? 'medium') === 'easy'
                ? 'bg-emerald-400/20 border-emerald-300/30'
                : (question?.difficulty ?? 'medium') === 'medium'
                ? 'bg-amber-400/20 border-amber-300/30'
                : 'bg-rose-400/20 border-rose-300/30'
            }`}>
              {(question?.difficulty ?? 'medium').toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-[-0.8px]">{question?.title ?? 'Waiting for match...'}</h2>
          <p className="text-[#356769] text-sm">{question?.description ?? 'Join a lobby mode to receive a problem and start battling.'}</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#71C9CE]/30 bg-[#f5fcfc] p-3 text-xs">
              <p className="font-semibold mb-1">Examples</p>
              <ul className="space-y-1 list-disc pl-4">
                {(question?.examples ?? ['Example: Input ... Output ...']).slice(0, 2).map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[#71C9CE]/30 bg-[#f5fcfc] p-3 text-xs">
              <p className="font-semibold mb-1">Constraints</p>
              <p>{question?.constraints ?? 'Will appear when match starts.'}</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center text-[#2d6466] py-1 text-sm font-semibold tracking-[0.08em]">YOU VS OPPONENT</div>

        <section className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-[#71C9CE] bg-[#0D2B2C] flex items-center justify-center"><User className="w-5 h-5" /></div>
                <div>
                  <p className="font-semibold">You</p>
                  <p className="text-xs text-[#568688]">ELO {myElo} • Lv {Math.max(1, Math.floor(myElo / 250))}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs ${statusClass(myStatus)}`}>{myStatus.toUpperCase()}</span>
            </div>
            <div className="mb-3 text-xs text-[#568688]">Tests: {myTests}/5</div>
            <div className="h-2 rounded-full bg-[#d7eded] mb-3 overflow-hidden">
              <progress className="battle-progress battle-progress-cyan" value={myTests} max={5} />
            </div>
            <div className="h-105 overflow-hidden rounded-lg border border-[#71C9CE]/20">
              <MonacoEditor
                theme="vs"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => {
                  const next = value ?? '';
                  setCode(next);
                  sendCodeUpdate(next);
                }}
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#fecaca] bg-[#fff7f7] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border-2 border-[#ef4444] bg-[#4b2727] text-[#ffd5d5] grid place-items-center text-xs font-semibold">
                  {avatarInitial(opponent?.name)}
                </div>
                <div>
                  <p className="font-semibold">{opponent?.name ?? 'Opponent'}</p>
                  <p className="text-xs text-[#9f5d5d]">ELO {opponent?.rating ?? '—'} • Lv {opponent ? Math.max(1, Math.floor(opponent.rating / 250)) : '—'}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs ${statusClass(opponentStatus)}`}>{opponentStatus.toUpperCase()}</span>
            </div>
            <div className="mb-3 text-xs text-[#9f5d5d]">Tests: {opponentTests}/5</div>
            <div className="h-2 rounded-full bg-[#f6dada] mb-3 overflow-hidden">
              <progress className="battle-progress battle-progress-red" value={opponentTests} max={5} />
            </div>
            <div className="h-105 rounded-lg border border-[#fca5a5]/30 bg-[#fff0f0] relative overflow-hidden">
              <div className="absolute inset-0 blur-[2px] opacity-80 p-4 text-[#8c5e5e] text-sm leading-6">
                <p>{'// opponent typing activity...'}</p>
                {Array.from({ length: Math.max(8, opponentLines) }).map((_, i) => (
                  <p key={i}>line {i + 1}: {'{ ... }'}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-xl border border-[#71C9CE]/30 bg-white/85 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[#356769]">
            Potential Reward: <strong>+35 ELO</strong> • <strong>+150 XP</strong>
          </div>
          <button
            onClick={handleSubmit}
            disabled={roomId === 'lobby'}
            className="px-5 py-3 rounded-xl bg-[#71C9CE] text-[#0D2B2C] font-semibold hover:-translate-y-0.5 disabled:opacity-55 disabled:cursor-not-allowed"
          >
            Submit Solution
          </button>
        </footer>
      </div>

      {result && (
        <div className="fixed inset-0 bg-[rgba(16,48,49,0.45)] z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-[#71C9CE]/35 bg-white p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#f6b73c]/20 border border-[#f6b73c]/35 grid place-items-center crown-pop">
                <Crown className="w-8 h-8 text-[#f6b73c]" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-center mb-6">{result.winner.userId === effectiveUserId ? 'Victory!' : 'Defeat'}</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-[#71C9CE]/25 bg-[#f5fcfc] p-4">
                <p className="font-semibold mb-2">You</p>
                <p className="text-sm">Time: {result.winner.userId === effectiveUserId ? result.winner.timeTaken : result.loser.timeTaken}s</p>
                <p className="text-sm">Tests: {result.winner.userId === effectiveUserId ? result.winner.testsPassed : result.loser.testsPassed}/5</p>
                <p className="text-sm">Lines: {result.winner.userId === effectiveUserId ? result.winner.codeLength : result.loser.codeLength}</p>
              </div>
              <div className="rounded-xl border border-[#71C9CE]/25 bg-[#f5fcfc] p-4">
                <p className="font-semibold mb-2">Opponent</p>
                <p className="text-sm">Time: {result.winner.userId !== effectiveUserId ? result.winner.timeTaken : result.loser.timeTaken}s</p>
                <p className="text-sm">Tests: {result.winner.userId !== effectiveUserId ? result.winner.testsPassed : result.loser.testsPassed}/5</p>
                <p className="text-sm">Lines: {result.winner.userId !== effectiveUserId ? result.winner.codeLength : result.loser.codeLength}</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className={`text-2xl font-bold ${(result.eloChange[effectiveUserId] ?? 0) >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                ELO {result.eloChange[effectiveUserId] >= 0 ? '+' : ''}{result.eloChange[effectiveUserId] ?? 0}
              </p>
              <p className="text-sm text-[#467577]">XP +{result.xpGained[effectiveUserId] ?? 0}</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={requestRematch} className="px-4 py-2 rounded-lg bg-[#71C9CE] text-[#0D2B2C] font-semibold">Rematch</button>
              <button onClick={() => handleModeSelect('ranked')} className="px-4 py-2 rounded-lg border border-[#71C9CE]/30">New Opponent</button>
              <button className="px-4 py-2 rounded-lg border border-[#71C9CE]/30">View Solution</button>
              <button onClick={() => { setResult(null); handleModeSelect(mode); }} className="px-4 py-2 rounded-lg border border-[#71C9CE]/30">Back to Lobby</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;
