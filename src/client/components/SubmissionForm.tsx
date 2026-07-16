import { useEffect, useState } from 'react';
import type { Category } from '../../shared/api';

interface SubmissionFormProps {
  categories: Category[];
  onSubmit: (answers: Record<string, string>) => void;
  onTick: (secondsLeft: number) => void;
  initialSecondsLeft: number;
}

export function SubmissionForm({ categories, onSubmit, onTick, initialSecondsLeft, }: SubmissionFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (categoryId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    onSubmit(answers);
  };

  // Countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      handleSubmit(); // auto-submit whatever's filled in
      return;
    }
    onTick(secondsLeft);
    const timeout = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const allAnswered = categories.every((cat) => (answers[cat.id] ?? '').trim().length > 0);

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-xl flex flex-col gap-5">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow">
              <span className="text-2xl font-bold text-purple-700">
                {category.letter.toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <span className="inline-block bg-white/90 text-purple-800 text-xs font-semibold rounded-full px-3 py-1 mb-1 ml-2">
                {category.prompt}
              </span>
              <input
                type="text"
                value={answers[category.id] ?? ''}
                onChange={(e) => handleChange(category.id, e.target.value)}
                placeholder="Type your answer..."
                className="w-full h-12 bg-gradient-to-r from-purple-800 to-purple-900 text-white placeholder-purple-300 rounded-full px-5 border-4 border-yellow-300 focus:outline-none focus:border-yellow-100"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className="mt-2 bg-yellow-300 text-purple-900 font-bold rounded-full px-8 py-3 shadow disabled:opacity-40"
      >
        Submit Answers
      </button>
    </div>
  );
}