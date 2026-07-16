import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { navigateTo } from '@devvit/web/client';
import { useLetterFeud } from './hooks/useLetterFeud';
import { SubmissionForm } from './components/SubmissionForm';
import { ResultsReveal } from './components/ResultsReveal';
import { PuzzleHeader } from './components/PuzzleHeader';
import { StartScreen } from './components/StartScreen';

export const App = () => {
  const {
    categories,
    result,
    started,
    secondsLeft,
    loading,
    start,
    submit,
    setSecondsLeft,
  } = useLetterFeud();

  return (
    <div
      className="flex relative flex-col items-center min-h-screen gap-2 pt-4 pb-20"
      style={{
        background:
          'radial-gradient(circle, rgba(255, 102, 204, 0.95) 0%, rgba(235, 153, 59, 1) 51%, rgba(198, 112, 255, 1) 87%)',
      }}
    >
      {loading && <p className="text-white text-lg">Loading today's puzzle...</p>}

      {!loading && categories && !result && !started && (
        <StartScreen onStart={start} />
      )}

      {!loading && categories && !result && started && (
        <>
          <PuzzleHeader secondsLeft={secondsLeft} />
          <SubmissionForm
            categories={categories}
            onSubmit={submit}
            onTick={setSecondsLeft}
            initialSecondsLeft={secondsLeft}
          />
        </>
      )}

      {!loading && result && <ResultsReveal result={result} />}

      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600 dark:text-gray-400">
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://www.reddit.com/r/Devvit')}
        >
          r/Devvit
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => navigateTo('https://discord.com/invite/R7yu2wh9Qz')}
        >
          Discord
        </button>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);