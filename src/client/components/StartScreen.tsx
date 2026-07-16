import { playStartSound } from '../utils/playStartSound';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const handleStart = () => {
    playStartSound();
    onStart();
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center px-6">
      <img
        src="/letter-feud-badge-v2.svg"
        alt="Letter Feud"
        className="w-full max-w-[220px]"
      />
      <p className="text-white text-lg max-w-sm drop-shadow">
        You've got 60 seconds to answer 5 categories. Match what the community usually says to score big.
      </p>
      <button
        onClick={handleStart}
        className="bg-yellow-300 text-purple-900 font-bold rounded-full px-10 py-3 shadow-md hover:bg-yellow-200 transition-colors"
      >
        Start
      </button>
    </div>
  );
}