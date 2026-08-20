'use client';

import * as React from 'react';
import { Camera, PenLine, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InputMode = 'text' | 'photo';

export interface ExerciseSubmission {
  mode: InputMode;
  text: string;
}

interface ExerciseFormProps {
  onSubmit: (submission: ExerciseSubmission) => void;
}

export function ExerciseForm({ onSubmit }: ExerciseFormProps) {
  const [mode, setMode] = React.useState<InputMode>('text');
  const [text, setText] = React.useState('');
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const switchMode = (nextMode: InputMode) => {
    setMode(nextMode);
    setError(null);
  };

  const handleSubmit = () => {
    if (mode === 'text' && text.trim().length === 0) {
      setError('Escribí tu ejercicio antes de continuar.');
      return;
    }
    if (mode === 'photo' && !photoPreview) {
      setError('Subí o tomá una foto de tu ejercicio antes de continuar.');
      return;
    }
    setError(null);
    onSubmit({ mode, text: mode === 'text' ? text.trim() : '' });
  };

  return (
    <div className="card-retro-lg w-full p-6 sm:p-8">
      <div className="mb-6 flex gap-2 rounded-full border-[3px] border-tiza-night bg-tiza-cream p-1">
        <button
          type="button"
          onClick={() => switchMode('text')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-extrabold transition-colors sm:text-base',
            mode === 'text'
              ? 'bg-tiza-night text-tiza-cream'
              : 'text-tiza-night/70 hover:bg-white hover:text-tiza-night'
          )}
        >
          <PenLine className="h-4 w-4" />
          Escribir
        </button>
        <button
          type="button"
          onClick={() => switchMode('photo')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-extrabold transition-colors sm:text-base',
            mode === 'photo'
              ? 'bg-tiza-night text-tiza-cream'
              : 'text-tiza-night/70 hover:bg-white hover:text-tiza-night'
          )}
        >
          <Camera className="h-4 w-4" />
          Foto
        </button>
      </div>

      {mode === 'text' ? (
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
          placeholder="Escribí tu ejercicio aquí... ej: 24 + 18"
          rows={5}
          className="w-full resize-none rounded-2xl border-[3px] border-tiza-night bg-tiza-cream p-4 text-lg font-bold text-tiza-night placeholder:font-normal placeholder:text-tiza-night/40 focus:outline-none focus:ring-4 focus:ring-tiza-coral/40"
        />
      ) : (
        <div>
          {photoPreview ? (
            <div className="relative overflow-hidden rounded-2xl border-[3px] border-tiza-night shadow-retro-sm">
              <img
                src={photoPreview}
                alt="Foto del ejercicio"
                className="h-56 w-full object-cover"
              />
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute right-3 top-3 rounded-full border-2 border-tiza-night bg-white p-1.5 shadow-retro-sm"
                aria-label="Quitar foto"
              >
                <X className="h-4 w-4 text-tiza-night" />
              </button>
            </div>
          ) : (
            <label className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-tiza-night/50 bg-tiza-cream text-center transition-colors hover:border-tiza-coral hover:bg-tiza-cream/80">
              <Camera className="h-10 w-10 text-tiza-night/50" />
              <span className="px-4 font-extrabold text-tiza-night">
                Tocá para subir o tomar una foto
              </span>
              <span className="px-4 text-sm text-tiza-night/50">
                Sacale una foto clara a tu ejercicio
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm font-bold text-tiza-coral">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="btn-coral mt-6 w-full text-xl"
      >
        <Sparkles className="h-5 w-5" />
        ¡Ayúdame a resolverlo! 🚀
      </button>
    </div>
  );
}
