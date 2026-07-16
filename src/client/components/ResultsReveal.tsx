import type { ResultResponse } from '../../shared/api';

interface ResultsRevealProps {
  result: ResultResponse;
}

export function ResultsReveal({ result }: ResultsRevealProps) {
  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-extrabold text-yellow-300 tracking-wide drop-shadow-md">
        RESULTS
      </h1>

      <div className="w-full max-w-xl flex flex-col gap-4">
        {result.categoryResults.map((r, index) => (
          <div
            key={r.category.id}
            className="flex items-center gap-3 opacity-0 animate-fadeInUp"
            style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
          >
            {/* Letter tile */}
            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-purple-700">
                {r.category.letter.toUpperCase()}
              </span>
            </div>

            {/* Answer + rank/points */}
            <div className="flex-1 bg-gradient-to-r from-purple-800 to-purple-900 text-white rounded-full px-5 h-12 border-4 border-yellow-300 flex items-center justify-between">
              <span className="truncate">
                {r.answer || <span className="italic text-purple-300">no answer</span>}
              </span>
              <span className="flex-shrink-0 ml-3 font-bold text-yellow-300">
                {r.rank ? `#${r.rank}` : 'new'} · +{r.points}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-col items-center gap-1">
        <p className="text-2xl font-extrabold text-white drop-shadow">
          Total: {result.totalScore} points
        </p>
        <p className="text-sm text-white/80">
          🔥 Current streak: {result.currentStreak} day{result.currentStreak === 1 ? '' : 's'}
        </p>
      </div>
    </div>
  );
}