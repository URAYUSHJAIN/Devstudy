import { NextResponse } from 'next/server';
import codechefProblems from '@/data/codechef-problems.json';
import problemBank from '@/data/problem-bank.json';

type Difficulty = 'easy' | 'medium' | 'hard';
type Source = 'leetcode' | 'codechef' | 'random';

type NormalizedQuestion = {
  id: string;
  title: string;
  description: string;
  examples: string[];
  constraints: string;
  difficulty: Difficulty;
  source: 'leetcode' | 'codechef';
  timeLimit: string;
};

type CacheRecord = {
  expiresAt: number;
  value: NormalizedQuestion;
};

const CACHE_TTL_MS = 60 * 60 * 1000;
const questionCache = new Map<string, CacheRecord>();

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
const CODECHEF_PROBLEM_URL = 'https://www.codechef.com/api/contests/PRACTICE/problems';

const difficultySet = new Set(['easy', 'medium', 'hard']);
const sourceSet = new Set(['leetcode', 'codechef', 'random']);

function normalizeDifficulty(value: string | null): Difficulty | null {
  if (!value) {
    return null;
  }
  const lowered = value.toLowerCase();
  return difficultySet.has(lowered) ? (lowered as Difficulty) : null;
}

function normalizeSource(value: string | null): Source {
  if (!value) {
    return 'random';
  }
  const lowered = value.toLowerCase();
  return sourceSet.has(lowered) ? (lowered as Source) : 'random';
}

function cleanHtml(input: string): string {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function filterByDifficulty<T extends { difficulty: string }>(items: T[], difficulty: Difficulty | null): T[] {
  if (!difficulty) {
    return items;
  }
  const matches = items.filter((item) => item.difficulty.toLowerCase() === difficulty);
  return matches.length > 0 ? matches : items;
}

function fromProblemBank(source: 'leetcode' | 'codechef', difficulty: Difficulty | null): NormalizedQuestion {
  const sourceMatches = problemBank.filter((q) => q.source === source);
  const difficultyMatches = filterByDifficulty(sourceMatches.length > 0 ? sourceMatches : problemBank, difficulty);
  const picked = randomPick(difficultyMatches);

  return {
    id: picked.id,
    title: picked.title,
    description: picked.description,
    examples: picked.examples,
    constraints: picked.constraints,
    difficulty: picked.difficulty as Difficulty,
    source,
    timeLimit: picked.timeLimit,
  };
}

async function fetchLeetCodeQuestion(difficulty: Difficulty | null): Promise<NormalizedQuestion | null> {
  const query = `
    query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {
      randomQuestion(categorySlug: $categorySlug, filters: $filters) {
        title
        titleSlug
        difficulty
        content
        exampleTestcaseList
        hints
      }
    }
  `;

  const variables = {
    categorySlug: 'all-code-essentials',
    filters: difficulty
      ? {
          difficulty: difficulty.toUpperCase(),
        }
      : {},
  };

  try {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com/problemset/',
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const payload = (await res.json()) as {
      data?: {
        randomQuestion?: {
          title?: string;
          titleSlug?: string;
          difficulty?: string;
          content?: string;
          exampleTestcaseList?: string[];
          hints?: string[];
        };
      };
    };

    const question = payload.data?.randomQuestion;
    if (!question?.title || !question?.titleSlug) {
      return null;
    }

    const normalizedDifficulty = normalizeDifficulty(question.difficulty ?? null) ?? difficulty ?? 'medium';

    return {
      id: `lc-${question.titleSlug}`,
      title: question.title,
      description: cleanHtml(question.content ?? ''),
      examples:
        (question.exampleTestcaseList ?? []).slice(0, 3).map((s) => s.trim()).filter(Boolean).length > 0
          ? (question.exampleTestcaseList ?? []).slice(0, 3).map((s) => s.trim()).filter(Boolean)
          : (question.hints ?? []).slice(0, 2).map((s) => cleanHtml(s)).filter(Boolean),
      constraints: 'Refer to the original LeetCode problem statement for complete constraints.',
      difficulty: normalizedDifficulty,
      source: 'leetcode',
      timeLimit: '1 sec',
    };
  } catch {
    return null;
  }
}

async function fetchCodeChefQuestion(difficulty: Difficulty | null): Promise<NormalizedQuestion | null> {
  const candidates = filterByDifficulty(codechefProblems, difficulty);
  const fallbackPick = randomPick(candidates);

  try {
    const res = await fetch(`${CODECHEF_PROBLEM_URL}/${fallbackPick.problemCode}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('CodeChef API unavailable');
    }

    const payload = (await res.json()) as {
      problem?: {
        problemCode?: string;
        problemName?: string;
        body?: string;
        constraints?: string;
        maxTimeLimit?: string;
      };
    };

    const remote = payload.problem;
    if (!remote?.problemCode || !remote.problemName) {
      throw new Error('Invalid CodeChef payload');
    }

    return {
      id: `cc-${remote.problemCode}`,
      title: remote.problemName,
      description: cleanHtml(remote.body ?? fallbackPick.statement),
      examples: fallbackPick.examples,
      constraints: cleanHtml(remote.constraints ?? fallbackPick.constraints),
      difficulty: fallbackPick.difficulty as Difficulty,
      source: 'codechef',
      timeLimit: remote.maxTimeLimit || fallbackPick.timeLimit,
    };
  } catch {
    return {
      id: `cc-${fallbackPick.problemCode}`,
      title: fallbackPick.title,
      description: fallbackPick.statement,
      examples: fallbackPick.examples,
      constraints: fallbackPick.constraints,
      difficulty: fallbackPick.difficulty as Difficulty,
      source: 'codechef',
      timeLimit: fallbackPick.timeLimit,
    };
  }
}

async function resolveQuestion(source: Source, difficulty: Difficulty | null): Promise<NormalizedQuestion> {
  if (source === 'leetcode') {
    return (await fetchLeetCodeQuestion(difficulty)) ?? fromProblemBank('leetcode', difficulty);
  }

  if (source === 'codechef') {
    return (await fetchCodeChefQuestion(difficulty)) ?? fromProblemBank('codechef', difficulty);
  }

  const shuffledSources: Array<'leetcode' | 'codechef'> = Math.random() > 0.5 ? ['leetcode', 'codechef'] : ['codechef', 'leetcode'];

  for (const candidate of shuffledSources) {
    const result = candidate === 'leetcode'
      ? await fetchLeetCodeQuestion(difficulty)
      : await fetchCodeChefQuestion(difficulty);

    if (result) {
      return result;
    }
  }

  return fromProblemBank(Math.random() > 0.5 ? 'leetcode' : 'codechef', difficulty);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const source = normalizeSource(searchParams.get('source'));
  const difficulty = normalizeDifficulty(searchParams.get('difficulty'));

  const cacheKey = `${source}:${difficulty ?? 'any'}`;
  const now = Date.now();

  const cached = questionCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.value);
  }

  try {
    const question = await resolveQuestion(source, difficulty);

    questionCache.set(cacheKey, {
      value: question,
      expiresAt: now + CACHE_TTL_MS,
    });

    return NextResponse.json(question);
  } catch {
    const fallback = fromProblemBank(source === 'random' ? 'leetcode' : source, difficulty);
    return NextResponse.json(fallback);
  }
}
