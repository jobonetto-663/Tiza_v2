'use client';

import * as React from 'react';
import { CheckCircle2, Lightbulb, RotateCcw, Search, SquarePen, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SpeakButton } from '@/components/tiza/speak-button';
import type { ExercisePlan, ParsedExercise } from '@/lib/tiza/exercise-engine';
import { regeneratePractice } from '@/lib/tiza/exercise-engine';

const CORRECT_MSG = '¡Excelente! 🌟 Lo lograste';
const INCORRECT_MSG = '¡Casi! Revisa tus cuentas e inténtalo de nuevo 💪';

interface AnswerCheckerProps {
  answer: number | null;
  accent: 'coral' | 'teal';
}

function AnswerChecker({ answer, accent }: AnswerCheckerProps) {
  const [value, setValue] = React.useState('');
  const [feedback, setFeedback] = React.useState<
    { type: 'correct' | 'incorrect'; message: string } | null
  >(null);

  const handleCheck = () => {
    const num = parseInt(value.trim(), 10);
    if (Number.isNaN(num)) {
      setFeedback({
        type: 'incorrect',
        message: 'Ingresá un número para comprobar tu respuesta.',
      });
      return;
    }
    if (answer === null) {
      setFeedback(null);
      return;
    }
    setFeedback({
      type: num === answer ? 'correct' : 'incorrect',
      message: num === answer ? CORRECT_MSG : INCORRECT_MSG,
    });
  };

  const ringColor = accent === 'coral' ? 'focus:ring-tiza-coral/30' : 'focus:ring-tiza-teal/30';
  const btnColor = accent === 'coral' ? 'bg-tiza-coral' : 'bg-tiza-teal';

  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-extrabold text-tiza-night">
        ¿Ya tenés tu resultado? Ponelo acá:
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCheck();
          }}
          placeholder="Tu resultado"
          className={cn(
            'w-full rounded-full border-[3px] border-tiza-night bg-white px-4 py-2.5 text-base font-bold text-tiza-night placeholder:font-normal placeholder:text-tiza-night/40 focus:outline-none focus:ring-4',
            ringColor
          )}
        />
        <button
          type="button"
          onClick={handleCheck}
          className={cn(
            'btn-retro flex-shrink-0 px-4 py-2.5 text-sm text-white',
            btnColor
          )}
        >
          <CheckCircle2 className="h-4 w-4" />
          Comprobar respuesta
        </button>
      </div>
      {feedback && (
        <div
          className={cn(
            'mt-3 flex items-center gap-2 rounded-2xl border-[3px] border-tiza-night px-4 py-3 text-sm font-extrabold',
            feedback.type === 'correct'
              ? 'bg-tiza-teal text-white'
              : 'bg-tiza-mustard text-tiza-night'
          )}
        >
          {feedback.type === 'correct' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 flex-shrink-0" />
          )}
          {feedback.message}
        </div>
      )}
    </div>
  );
}

interface ResultsViewProps {
  plan: ExercisePlan;
  parsedExercise: ParsedExercise | null;
  exerciseLabel: string;
  onReset: () => void;
}

export function ResultsView({
  plan,
  parsedExercise,
  exerciseLabel,
  onReset,
}: ResultsViewProps) {
  const [practice, setPractice] = React.useState({
    prompt: plan.practicePrompt,
    tip: plan.practiceTip,
    answer: plan.practiceAnswer,
  });

  const handleNewPractice = () => {
    setPractice(regeneratePractice(parsedExercise));
  };

  return (
    <div className="w-full">
      <div className="mb-4 rounded-2xl border-[3px] border-tiza-night bg-white px-5 py-3 shadow-retro-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-tiza-night/50">
          {plan.operationLabel} · Tu ejercicio
        </p>
        <p className="font-display text-lg font-bold text-tiza-night">
          {exerciseLabel}
        </p>
      </div>

      {plan.originalAnswer !== null && (
        <div className="mb-4 rounded-2xl border-[3px] border-tiza-night bg-tiza-cream px-5 py-4 shadow-retro-sm">
          <AnswerChecker answer={plan.originalAnswer} accent="coral" />
        </div>
      )}

      <Tabs defaultValue="how" className="w-full">
        <TabsList className="h-auto w-full gap-1 rounded-full border-[3px] border-tiza-night bg-tiza-cream p-1.5 shadow-retro-sm">
          <TabsTrigger
            value="how"
            className="flex-1 rounded-full border-[3px] border-transparent px-2 py-2.5 text-xs font-extrabold text-tiza-night transition-all data-[state=active]:border-tiza-night data-[state=active]:bg-tiza-coral data-[state=active]:text-white data-[state=active]:shadow-retro-sm sm:text-sm"
          >
            💡 ¿Cómo se hace?
          </TabsTrigger>
          <TabsTrigger
            value="hint"
            className="flex-1 rounded-full border-[3px] border-transparent px-2 py-2.5 text-xs font-extrabold text-tiza-night transition-all data-[state=active]:border-tiza-night data-[state=active]:bg-tiza-mustard data-[state=active]:text-tiza-night data-[state=active]:shadow-retro-sm sm:text-sm"
          >
            🔍 Una pista
          </TabsTrigger>
          <TabsTrigger
            value="practice"
            className="flex-1 rounded-full border-[3px] border-transparent px-2 py-2.5 text-xs font-extrabold text-tiza-night transition-all data-[state=active]:border-tiza-night data-[state=active]:bg-tiza-teal data-[state=active]:text-white data-[state=active]:shadow-retro-sm sm:text-sm"
          >
            ✏️ Practica otro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="how" className="mt-4">
          <ResultCard accent="coral">
            <CardHeading icon={<Lightbulb className="h-5 w-5" />}>
              ¿Cómo se hace?
            </CardHeading>
            <ol className="space-y-3">
              {plan.howTo.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-tiza-coral text-xs font-extrabold text-white">
                    {index + 1}
                  </span>
                  <span className="text-base leading-relaxed text-tiza-night">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <SpeakButton
              text={plan.howTo.join('. ')}
              className="mt-5"
            />
            {plan.originalAnswer !== null && (
              <AnswerChecker answer={plan.originalAnswer} accent="coral" />
            )}
          </ResultCard>
        </TabsContent>

        <TabsContent value="hint" className="mt-4">
          <ResultCard accent="mustard">
            <CardHeading icon={<Search className="h-5 w-5" />}>
              Una pista
            </CardHeading>
            <p className="text-base leading-relaxed text-tiza-night">
              {plan.hint}
            </p>
            <SpeakButton text={plan.hint} className="mt-5" />
          </ResultCard>
        </TabsContent>

        <TabsContent value="practice" className="mt-4">
          <ResultCard accent="teal">
            <CardHeading icon={<SquarePen className="h-5 w-5" />}>
              Practica otro
            </CardHeading>
            <p className="rounded-2xl border-[3px] border-tiza-night bg-tiza-cream px-4 py-4 text-center font-display text-2xl font-bold text-tiza-night shadow-retro-sm">
              {practice.prompt}
            </p>
            <p className="mt-3 text-base leading-relaxed text-tiza-night">
              {practice.tip}
            </p>

            {practice.answer !== null && (
              <AnswerChecker answer={practice.answer} accent="teal" />
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <SpeakButton text={`${practice.prompt}. ${practice.tip}`} />
              <button
                type="button"
                onClick={handleNewPractice}
                className="btn-retro bg-white px-4 py-2 text-sm text-tiza-night"
              >
                <RotateCcw className="h-4 w-4" />
                Otro ejercicio
              </button>
            </div>
          </ResultCard>
        </TabsContent>
      </Tabs>

      <button
        type="button"
        onClick={onReset}
        className="btn-night mt-6 w-full"
      >
        🔄 Nuevo ejercicio
      </button>
    </div>
  );
}

function ResultCard({
  accent,
  children,
}: {
  accent: 'coral' | 'mustard' | 'teal';
  children: React.ReactNode;
}) {
  const accentClass = {
    coral: 'shadow-retro',
    mustard: 'shadow-retro',
    teal: 'shadow-retro',
  }[accent];

  return (
    <div
      className={cn(
        'card-retro p-6 sm:p-7',
        accentClass
      )}
    >
      {children}
    </div>
  );
}

function CardHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2 text-tiza-night">
      {icon}
      <h2 className="font-display text-xl font-bold">{children}</h2>
    </div>
  );
}
