'use client';

import * as React from 'react';

const LOADING_MESSAGES = [
  'Dibujando las pistas...',
  'Analizando los números...',
  'Afilando el lápiz...',
  'Ordenando las ideas...',
  'Casi listo...',
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-retro-lg flex w-full flex-col items-center justify-center p-10">
      <div className="relative mb-6 h-24 w-32">
        <svg
          viewBox="0 0 200 80"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <path
            d="M10 60 Q 50 10, 90 55 T 190 40"
            stroke="#EEAA3B"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="260"
            className="animate-chalk-draw"
          />
        </svg>
        <div className="absolute -right-1 top-6 animate-floaty text-5xl">
          ✏️
        </div>
      </div>
      <p
        key={messageIndex}
        className="animate-pop-in font-display text-xl font-bold text-tiza-night sm:text-2xl"
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>
      <p className="mt-2 text-sm text-tiza-night/50">
        TIZA está preparando tus pistas
      </p>
    </div>
  );
}
