import { Category, CategoryResult } from "../../shared/api";

function normalizeAnswer(raw: string): string {
    let cleaned = raw.trim().toLowerCase()

    if (cleaned.startsWith("a ")) {
        cleaned = cleaned.slice(2); // removes the first 2 characters ("a ")
    } else if (cleaned.startsWith("an ")) {
        cleaned = cleaned.slice(3);
    } else if (cleaned.startsWith("the ")) {
        cleaned = cleaned.slice(4);
    }

    return cleaned
}

function isValidAnswer(cleaned: string, expectedLetter: string): boolean {
    return cleaned.startsWith(expectedLetter.toLowerCase())
}

function getRank(answer: string, board: Record<string, number>): number | null {
  const entries = Object.entries(board);
  entries.sort((a,b) => b[1] - a[1]);
  
  const index = entries.findIndex(([key, weight]) => key === answer);

  if (index == -1){
    return null;
  } else {
    return index + 1;
  }
}

function scoreFromRank(rank: number | null): number {
  if (rank === null) {
    return 5; 
  }

  switch (rank) {
    case 1:
      return 100;
    case 2:
      return 80;
    case 3:
      return 60;
    case 4:
      return 40;
    case 5:
      return 20;
    default:
      return 10;
  }
}

function scoreAnswer(rawAnswer: string, category: Category, board: Record<string, number>): CategoryResult {
  const answer = normalizeAnswer(rawAnswer);

  if (!isValidAnswer(answer, category.letter)) {
    return {
      category,
      answer,
      rank: null,
      points: 0,
    };
  }

  const rank = getRank(answer, board);

  if (rank === null) {
    // brand new answer — seed it into the board at the lowest weight
    board[answer] = 1;
  }

  const points = scoreFromRank(rank);

  return {
    category,
    answer,
    rank,
    points,
  };
}

export function scoreSubmission(
  answers: Record<string, string>, // categoryId -> raw answer
  puzzle: Category[],
  boards: Record<string, Record<string, number>> // categoryId -> board
): { categoryResults: CategoryResult[]; totalScore: number } {
  const categoryResults: CategoryResult[] = [];
  let totalScore = 0;

  for (const category of puzzle) {
    const rawAnswer = answers[category.id] ?? "";
    const board = boards[category.id] ?? {};

    const result = scoreAnswer(rawAnswer, category, board);
    categoryResults.push(result);
    totalScore += result.points;
  }

  return { categoryResults, totalScore };
}