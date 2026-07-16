import { useCallback, useEffect, useState } from 'react';
import type { PuzzleResponse, StatusResponse, ResultResponse, Category } from '../../shared/api';

interface LetterFeudState {
  categories: Category[] | null;
  result: ResultResponse | null;
  started: boolean;
  secondsLeft: number;
  loading: boolean;
}

export const useLetterFeud = () => {
  const [state, setState] = useState<LetterFeudState>({
    categories: null,
    result: null,
    started: false,
    secondsLeft: 60,
    loading: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [puzzleRes, statusRes] = await Promise.all([
          fetch('/api/puzzle'),
          fetch('/api/status'),
        ]);

        const puzzleData: PuzzleResponse = await puzzleRes.json();
        const statusData: StatusResponse = await statusRes.json();

        setState({
          categories: puzzleData.categories,
          result: statusData.result,
          started: statusData.started,
          secondsLeft: statusData.secondsLeft,
          loading: false,
        });
      } catch (err) {
        console.error('Failed to init Letter Feud', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    void init();
  }, []);

  const start = useCallback(async () => {
    try {
      await fetch('/api/start', { method: 'POST' });
      setState((prev) => ({ ...prev, started: true, secondsLeft: 60 }));
    } catch (err) {
      console.error('Failed to start', err);
    }
  }, []);

  const submit = useCallback(async (answers: Record<string, string>) => {
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data: ResultResponse = await res.json();
      setState((prev) => ({ ...prev, result: data }));
    } catch (err) {
      console.error('Failed to submit answers', err);
    }
  }, []);

  const setSecondsLeft = useCallback((n: number) => {
    setState((prev) => ({ ...prev, secondsLeft: n }));
  }, []);

  return { ...state, start, submit, setSecondsLeft } as const;
};