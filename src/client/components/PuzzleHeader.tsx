interface PuzzleHeaderProps {
  secondsLeft: number;
}

export function PuzzleHeader({ secondsLeft }: PuzzleHeaderProps) {
  return (
    <div className="w-full max-w-xl flex items-center justify-between px-2">
      <span className="text-white font-semibold text-lg drop-shadow">
        Today's puzzle:
      </span>
      <span
        className={`font-bold text-lg px-3 py-1 rounded-full ${
          secondsLeft <= 10 ? 'bg-red-500 text-white' : 'bg-white/90 text-purple-800'
        }`}
      >
        0:{secondsLeft.toString().padStart(2, '0')}
      </span>
    </div>
  );
}