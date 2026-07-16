import { Hono } from 'hono';
import { context, redis, reddit } from '@devvit/web/server';
import { todaysPuzzle, seedBoards } from '../core/puzzleData';
import type {
  DecrementResponse,
  IncrementResponse,
  InitResponse,
  SubmissionRequest, 
  ResultResponse, 
  PuzzleResponse,
  StatusResponse
} from '../../shared/api';
import { scoreSubmission } from '../core/scoring';




type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

api.get('/init', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    const [count, username] = await Promise.all([
      redis.get('count'),
      reddit.getCurrentUsername(),
    ]);

    return c.json<InitResponse>({
      type: 'init',
      postId: postId,
      count: count ? parseInt(count) : 0,
      username: username ?? 'anonymous',
    });
  } catch (error) {
    console.error(`API Init Error for post ${postId}:`, error);
    let errorMessage = 'Unknown error during initialization';
    if (error instanceof Error) {
      errorMessage = `Initialization failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});

api.post('/increment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', 1);
  return c.json<IncrementResponse>({
    count,
    postId,
    type: 'increment',
  });
});

api.post('/decrement', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required',
      },
      400
    );
  }

  const count = await redis.incrBy('count', -1);
  return c.json<DecrementResponse>({
    count,
    postId,
    type: 'decrement',
  });
});


api.get('/puzzle', async (c) => {
  const { postId } = context;

  if (!postId) {
    console.error('API Init Error: postId not found in devvit context');
    return c.json<ErrorResponse>(
      {
        status: 'error',
        message: 'postId is required but missing from context',
      },
      400
    );
  }

  try {
    return c.json<PuzzleResponse>({
      type: 'puzzle',
      postId: postId,
      categories: todaysPuzzle,
    });

  } catch (error) {
    console.error('API Puzzle Error');

    let errorMessage = 'Unknown error fetching puzzle';
    if (error instanceof Error) {
      errorMessage = `Fetching puzzle failed: ${error.message}`;
    }
    return c.json<ErrorResponse>(
      { status: 'error', message: errorMessage },
      400
    );
  }
});


api.post('/submit', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required' },
      400
    );
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const resultKey = `result:${postId}:${today}:${username}`;

    // Prevent double-submission — if a result already exists for today, return it as-is
    const existing = await redis.get(resultKey);
    if (existing) {
      return c.json<ResultResponse>(JSON.parse(existing));
    }

    const body = await c.req.json<{ answers: Record<string, string> }>();
    const answers = body.answers;

    const boards: Record<string, Record<string, number>> = {};
    for (const category of todaysPuzzle) {
      const stored = await redis.get(`board:${category.id}`);
      boards[category.id] = stored
        ? JSON.parse(stored)
        : { ...seedBoards[category.id] };
    }

    const { categoryResults, totalScore } = scoreSubmission(
      answers,
      todaysPuzzle,
      boards
    );

    for (const category of todaysPuzzle) {
      await redis.set(`board:${category.id}`, JSON.stringify(boards[category.id]));
    }

    // --- Streak logic ---
    const streakKey = `streak:${username}`;
    const storedStreak = await redis.get(streakKey);
    const streak = storedStreak
      ? JSON.parse(storedStreak)
      : { currentStreak: 0, longestStreak: 0, lastPlayedDate: null };

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (streak.lastPlayedDate === yesterday) {
      streak.currentStreak += 1;
    } else if (streak.lastPlayedDate !== today) {
      streak.currentStreak = 1;
    }
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.lastPlayedDate = today;
    await redis.set(streakKey, JSON.stringify(streak));

    const result: ResultResponse = {
      type: 'result',
      postId,
      categoryResults,
      totalScore,
      currentStreak: streak.currentStreak,
    };

    // Persist this result so re-visits today show the same thing
    await redis.set(resultKey, JSON.stringify(result));

    return c.json<ResultResponse>(result);
  } catch (error) {
    console.error('API Submit Error:', error);
    let errorMessage = 'Unknown error scoring submission';
    if (error instanceof Error) {
      errorMessage = `Submission failed: ${error.message}`;
    }
    return c.json<ErrorResponse>({ status: 'error', message: errorMessage }, 400);
  }
});

api.get('/result', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>(
      { status: 'error', message: 'postId is required' },
      400
    );
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const today = new Date().toISOString().slice(0, 10);
    const resultKey = `result:${postId}:${today}:${username}`;

    const existing = await redis.get(resultKey);
    if (!existing) {
      return c.json({ type: 'no-result' as const });
    }

    return c.json<ResultResponse>(JSON.parse(existing));
  } catch (error) {
    console.error('API Result Error:', error);
    let errorMessage = 'Unknown error fetching result';
    if (error instanceof Error) {
      errorMessage = `Fetching result failed: ${error.message}`;
    }
    return c.json<ErrorResponse>({ status: 'error', message: errorMessage }, 400);
  }
});

api.post('/start', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const today = new Date().toISOString().slice(0, 10);
    const startKey = `start:${postId}:${today}:${username}`;

    const existing = await redis.get(startKey);
    if (!existing) {
      await redis.set(startKey, Date.now().toString());
    }

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('API Start Error:', error);
    return c.json<ErrorResponse>({ status: 'error', message: 'Unknown error starting puzzle' }, 400);
  }
});

api.get('/status', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const today = new Date().toISOString().slice(0, 10);
    const startKey = `start:${postId}:${today}:${username}`;
    const resultKey = `result:${postId}:${today}:${username}`;

    const [startedAt, existingResult] = await Promise.all([
      redis.get(startKey),
      redis.get(resultKey),
    ]);

    if (existingResult) {
      return c.json<StatusResponse>({
        type: 'status',
        started: true,
        secondsLeft: 0,
        result: JSON.parse(existingResult),
      });
    }

    if (!startedAt) {
      return c.json<StatusResponse>({ type: 'status', started: false, secondsLeft: 60, result: null });
    }

    const elapsedSeconds = Math.floor((Date.now() - parseInt(startedAt)) / 1000);
    const secondsLeft = Math.max(60 - elapsedSeconds, 0);

    return c.json<StatusResponse>({ type: 'status', started: true, secondsLeft, result: null });
  } catch (error) {
    console.error('API Status Error:', error);
    return c.json<ErrorResponse>({ status: 'error', message: 'Unknown error fetching status' }, 400);
  }
});

api.post('/dev-reset', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<ErrorResponse>({ status: 'error', message: 'postId is required' }, 400);
  }

  try {
    const username = (await reddit.getCurrentUsername()) ?? 'anonymous';
    const today = new Date().toISOString().slice(0, 10);

    await redis.del(`start:${postId}:${today}:${username}`);
    await redis.del(`result:${postId}:${today}:${username}`);
    // Optional: also reset your streak so it doesn't inflate while testing
    await redis.del(`streak:${username}`);
    // Optional: remove yourself from today's leaderboard
    // await redis.zRem(`leaderboard:${postId}:${today}`, username);

    return c.json({ status: 'ok', message: 'Reset complete' });
  } catch (error) {
    console.error('API Dev Reset Error:', error);
    return c.json<ErrorResponse>({ status: 'error', message: 'Unknown error resetting' }, 400);
  }
});