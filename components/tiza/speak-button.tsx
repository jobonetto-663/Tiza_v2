'use client';

import * as React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  text: string;
  className?: string;
}

export function SpeakButton({ text, className }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);

  React.useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleClick = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isSupported}
      className={cn(
        'btn-retro bg-tiza-mustard px-4 py-2 text-sm text-tiza-night disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="h-4 w-4" />
          Detener
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          Escuchar
        </>
      )}
    </button>
  );
}
