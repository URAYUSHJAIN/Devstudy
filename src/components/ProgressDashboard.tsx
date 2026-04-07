'use client';

import React, { useMemo, useState } from 'react';

type BattleRecord = {
  date: string;
  opponent: string;
  problem: string;
  difficulty: 'easy' | 'medium' | 'hard';
  result: 'win' | 'loss';
  eloDelta: number;
  time: string;
};

type Profile = {
  elo: number;
  level: number;
  xp: number;
  streak: number;
  lastActive: string;
};

type Skills = {
  arrays: number;
  dp: number;
  graphs: number;
  trees: number;
  strings: number;
  math: number;
};

const DEFAULT_PROFILE: Profile = {
  elo: 1200,
  level: 1,
  xp: 0,
  streak: 0,
  lastActive: new Date().toISOString(),
};

const DEFAULT_SKILLS: Skills = {
  arrays: 40,
  dp: 25,
  graphs: 30,
  trees: 35,
  strings: 45,
  math: 20,
};

const PAGE_SIZE = 10;

function intensityColor(count: number) {
  if (count <= 0) return 'bg-[#71C9CE]/10';
  if (count === 1) return 'bg-[#71C9CE]/25';
  if (count === 2) return 'bg-[#71C9CE]/45';
  if (count === 3) return 'bg-[#71C9CE]/70';
  return 'bg-[#71C9CE]';
}

function formatDate(dateIso: string) {
  return new Date(dateIso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function asPercent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function buildRadarPoints(scores: number[], size: number, radius: number): string {
  const center = size / 2;
  const step = (Math.PI * 2) / scores.length;

  return scores
    .map((score, index) => {
      const angle = -Math.PI / 2 + index * step;
      const scaled = (score / 100) * radius;
      const x = center + Math.cos(angle) * scaled;
      const y = center + Math.sin(angle) * scaled;
      return `${x},${y}`;
    })
    .join(' ');
}

const ProgressDashboard = () => {
  const [page, setPage] = useState(1);

  const storageData = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        profile: DEFAULT_PROFILE,
        skills: DEFAULT_SKILLS,
        battles: [] as BattleRecord[],
        activity: {} as Record<string, number>,
      };
    }

    let profile: Profile = DEFAULT_PROFILE;
    let skills: Skills = DEFAULT_SKILLS;
    let battles: BattleRecord[] = [];
    let activity: Record<string, number> = {};

    const profileData = localStorage.getItem('ds_profile');
    if (profileData) {
      try {
        profile = { ...DEFAULT_PROFILE, ...JSON.parse(profileData) };
      } catch {
        profile = DEFAULT_PROFILE;
      }
    }

    const skillData = localStorage.getItem('ds_skills');
    if (skillData) {
      try {
        skills = { ...DEFAULT_SKILLS, ...JSON.parse(skillData) };
      } catch {
        skills = DEFAULT_SKILLS;
      }
    }

    const battlesData = localStorage.getItem('ds_battles');
    if (battlesData) {
      try {
        battles = (JSON.parse(battlesData) as BattleRecord[]).slice(0, 20);
      } catch {
        battles = [];
      }
    }

    const activityData = localStorage.getItem('ds_activity');
    if (activityData) {
      try {
        activity = JSON.parse(activityData) as Record<string, number>;
      } catch {
        activity = {};
      }
    }

    return { profile, skills, battles, activity };
  }, []);

  const { profile, skills, battles, activity } = storageData;

  const heatmapCells = useMemo(() => {
    const cells: Array<{ date: string; count: number }> = [];
    const today = new Date();

    for (let i = 83; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const iso = date.toISOString().slice(0, 10);
      cells.push({ date: iso, count: activity[iso] ?? 0 });
    }

    return cells;
  }, [activity]);

  const paginatedBattles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return battles.slice(start, start + PAGE_SIZE);
  }, [battles, page]);

  const totalPages = Math.max(1, Math.ceil(battles.length / PAGE_SIZE));

  const easyCount = battles.filter((b) => b.difficulty === 'easy').length;
  const mediumCount = battles.filter((b) => b.difficulty === 'medium').length;
  const hardCount = battles.filter((b) => b.difficulty === 'hard').length;
  const totalSolved = easyCount + mediumCount + hardCount;

  const skillLabels = ['Arrays', 'DP', 'Graphs', 'Trees', 'Strings', 'Math'];
  const skillValues = [skills.arrays, skills.dp, skills.graphs, skills.trees, skills.strings, skills.math];
  const radarSize = 280;
  const radarRadius = 95;
  const radarPolygon = buildRadarPoints(skillValues, radarSize, radarRadius);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Battles Won', value: battles.filter((b) => b.result === 'win').length },
          { label: 'ELO Rating', value: profile.elo },
          { label: 'Day Streak 🔥', value: profile.streak },
          { label: 'Current Level', value: profile.level },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-4 bg-[rgba(113,201,206,0.06)] border border-[rgba(113,201,206,0.15)]">
            <p className="text-xs text-(--muted) uppercase tracking-[0.06em]">{item.label}</p>
            <p className="text-2xl font-bold text-(--ink) mt-2">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl p-5 border border-[rgba(113,201,206,0.15)] bg-white/50">
        <h3 className="text-(--ink) text-lg font-semibold mb-3">12-Week Activity Heatmap</h3>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }).map((_, colIndex) => (
            <div key={`col-${colIndex}`} className="grid grid-rows-7 gap-1">
              {Array.from({ length: 7 }).map((__, rowIndex) => {
                const cell = heatmapCells[colIndex * 7 + rowIndex];
                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    title={`${cell.count} problems solved on ${cell.date}`}
                    className={`w-4 h-4 rounded-[3px] ${intensityColor(cell.count)}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl p-5 border border-[rgba(113,201,206,0.15)] bg-white/50">
        <h3 className="text-(--ink) text-lg font-semibold mb-3">Skill Radar</h3>
        <div className="overflow-x-auto">
          <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`} className="mx-auto">
            <g className="origin-center radar-scale-in">
              {Array.from({ length: 6 }).map((_, ringIndex) => {
                const ringScore = ((ringIndex + 1) / 6) * 100;
                const points = buildRadarPoints(new Array(6).fill(ringScore), radarSize, radarRadius);
                return <polygon key={ringIndex} points={points} fill="none" stroke="rgba(113,201,206,0.15)" />;
              })}
              <polygon points={radarPolygon} fill="rgba(113,201,206,0.2)" stroke="#71C9CE" strokeWidth="2" />
            </g>
            {skillLabels.map((label, index) => {
              const angle = -Math.PI / 2 + index * ((Math.PI * 2) / skillLabels.length);
              const x = radarSize / 2 + Math.cos(angle) * (radarRadius + 28);
              const y = radarSize / 2 + Math.sin(angle) * (radarRadius + 28);
              return (
                <text key={label} x={x} y={y} textAnchor="middle" className="fill-(--ink2) text-[12px] font-medium">
                  {label}
                </text>
              );
            })}
          </svg>
        </div>
      </section>

      <section className="rounded-xl p-5 border border-[rgba(113,201,206,0.15)] bg-white/50">
        <h3 className="text-(--ink) text-lg font-semibold mb-3">Battle History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-(--muted)">
                <th className="py-2">Date</th>
                <th className="py-2">Opponent</th>
                <th className="py-2">Problem</th>
                <th className="py-2">Difficulty</th>
                <th className="py-2">Result</th>
                <th className="py-2">ELO Δ</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBattles.map((battle, idx) => (
                <tr
                  key={`${battle.date}-${battle.problem}-${idx}`}
                  className={battle.result === 'win' ? 'bg-emerald-400/8' : 'bg-rose-400/8'}
                >
                  <td className="py-2">{formatDate(battle.date)}</td>
                  <td className="py-2">{battle.opponent}</td>
                  <td className="py-2">{battle.problem}</td>
                  <td className="py-2 capitalize">{battle.difficulty}</td>
                  <td className="py-2 capitalize">{battle.result}</td>
                  <td className={`py-2 ${battle.eloDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {battle.eloDelta >= 0 ? '+' : ''}{battle.eloDelta}
                  </td>
                  <td className="py-2">{battle.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg border border-[rgba(113,201,206,0.25)]"
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-xs text-(--muted)">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded-lg border border-[rgba(113,201,206,0.25)]"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </section>

      <section className="rounded-xl p-5 border border-[rgba(113,201,206,0.15)] bg-white/50">
        <h3 className="text-(--ink) text-lg font-semibold mb-3">Problem Difficulty Breakdown</h3>
        {[
          { label: 'Easy', count: easyCount, className: 'difficulty-progress-green' },
          { label: 'Medium', count: mediumCount, className: 'difficulty-progress-amber' },
          { label: 'Hard', count: hardCount, className: 'difficulty-progress-red' },
        ].map((item) => (
          <div key={item.label} className="mb-3">
            <div className="flex justify-between text-sm text-(--ink2)">
              <span>{item.label}</span>
              <span>{item.count} ({asPercent(item.count, totalSolved)}%)</span>
            </div>
            <div className="h-2 rounded-full bg-[rgba(113,201,206,0.12)] overflow-hidden mt-1">
              <progress className={`difficulty-progress ${item.className}`} value={item.count} max={Math.max(totalSolved, 1)} />
            </div>
          </div>
        ))}
      </section>

      <style>{`
        @keyframes radarScaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .radar-scale-in { animation: radarScaleIn 600ms ease-out; }
        .difficulty-progress { width: 100%; height: 100%; border: 0; }
        .difficulty-progress::-webkit-progress-bar { background: transparent; border-radius: 999px; }
        .difficulty-progress::-moz-progress-bar { border-radius: 999px; }
        .difficulty-progress-green::-webkit-progress-value { background: #22c55e; border-radius: 999px; }
        .difficulty-progress-green::-moz-progress-bar { background: #22c55e; }
        .difficulty-progress-amber::-webkit-progress-value { background: #f59e0b; border-radius: 999px; }
        .difficulty-progress-amber::-moz-progress-bar { background: #f59e0b; }
        .difficulty-progress-red::-webkit-progress-value { background: #ef4444; border-radius: 999px; }
        .difficulty-progress-red::-moz-progress-bar { background: #ef4444; }
      `}</style>
    </div>
  );
};

export default ProgressDashboard;
