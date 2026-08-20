'use client';

import * as React from 'react';
import { ExerciseForm } from '@/components/tiza/exercise-form';
import { LoadingScreen } from '@/components/tiza/loading-screen';
import { ResultsView } from '@/components/tiza/results-view';
import {
  buildExercisePlan,
  parseExercise,
  type ExercisePlan,
  type ParsedExercise,
} from '@/lib/tiza/exercise-engine';

type Phase = 'home' | 'loading' | 'results';

export default function Home() {
  const [phase, setPhase] = React.useState<Phase>('home');
  const [plan, setPlan] = React.useState<ExercisePlan | null>(null);
  const [parsedExercise, setParsedExercise] =
    React.useState<ParsedExercise | null>(null);
  const [exerciseLabel, setExerciseLabel] = React.useState('');

  const handleSubmit = (submission: { mode: string; text: string }) => {
    setPhase('loading');

    const isTextMode = submission.mode === 'text' && submission.text;
    const parsed = isTextMode ? parseExercise(submission.text) : null;

    setTimeout(() => {
      const newPlan = buildExercisePlan(parsed);
      const label = isTextMode ? submission.text : newPlan.practicePrompt;
      setPlan(newPlan);
      setParsedExercise(parsed);
      setExerciseLabel(label);
      setPhase('results');
    }, 2600);
  };

  const handleReset = () => {
    setPhase('home');
    setPlan(null);
    setParsedExercise(null);
    setExerciseLabel('');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-tiza-cream px-4 py-8 sm:py-12">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 hidden h-full w-16 sm:block">
        <div className="absolute inset-y-0 right-12 w-2 bg-tiza-coral" />
        <div className="absolute inset-y-0 right-9 w-2 bg-tiza-mustard" />
        <div className="absolute inset-y-0 right-6 w-2 bg-tiza-teal" />
        <div className="absolute inset-y-0 right-3 w-2 bg-tiza-night" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-[3px] border-tiza-night bg-tiza-mustard px-5 py-2 text-sm font-extrabold text-tiza-night shadow-retro-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <rect
                x="3.5"
                y="9.5"
                width="17"
                height="5"
                rx="2.5"
                transform="rotate(-45 12 12)"
                fill="#F9EFE3"
                stroke="#18283B"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            Matemáticas divertidas
          </div>
          <h1 className="font-display text-6xl font-bold tracking-tight text-tiza-night sm:text-8xl">
            TIZA
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base font-semibold text-tiza-night/70 sm:text-lg">
            Tu ayudante de matemáticas. Subí una foto o escribí tu ejercicio y
            te explico cómo resolverlo paso a paso.
          </p>
        </header>

        <div className="relative">
          {phase === 'home' && <ExerciseForm onSubmit={handleSubmit} />}

          {phase === 'loading' && <LoadingScreen />}

          {phase === 'results' && plan && (
            <ResultsView
              plan={plan}
              parsedExercise={parsedExercise}
              exerciseLabel={exerciseLabel}
              onReset={handleReset}
            />
          )}
        </div>

        <footer className="mt-10 border-t-[3px] border-tiza-night/20 pt-5 text-center">
          <p className="text-sm font-semibold text-tiza-night/50">
            Para chicos y chicas de 6 a 12 años · TIZA no da la respuesta, te
            enseña a pensar
          </p>
        </footer>
      </div>
    </main>
  );
}
