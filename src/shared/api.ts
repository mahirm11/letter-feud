export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export type Category = {
  id: string;
  prompt: string;
  letter: string;
};

export type PuzzleResponse = {
  type: 'puzzle';
  postId: string;
  categories: Category[];
};

export type SubmissionRequest = {
  type: 'submit_request';
  postId: string;
  answers: Record<string, string>;
};

export type CategoryResult = {
  category: Category;
  answer: string;
  rank: number | null;
  points: number;
};

export type ResultResponse = {
  type: 'result';
  postId: string;
  categoryResults: CategoryResult[];
  totalScore: number;
  currentStreak: number;
};

export type StatusResponse = {
  type: 'status';
  started: boolean;
  secondsLeft: number;
  result: ResultResponse | null;
};