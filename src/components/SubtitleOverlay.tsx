import React from 'react';
import { DIALOGUE_SCRIPT } from '../data/storyScript';
import { Bot, User, Sparkles } from 'lucide-react';

interface SubtitleOverlayProps {
  currentTime: number;
  showEnglish: boolean;
  visible: boolean;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  currentTime,
  showEnglish,
  visible,
}) => {
  if (!visible) return null;

  // Find dialogue active right now
  const activeLine = DIALOGUE_SCRIPT.find(
    (d) => currentTime >= d.startTime && currentTime <= d.endTime
  );

  if (!activeLine) return null;

  const isZizo = activeLine.speaker === 'zizo';

  return (
    <div className="pointer-events-none absolute bottom-24 inset-x-0 flex justify-center px-4 z-20 transition-all duration-300">
      <div
        className={`max-w-2xl w-full rounded-2xl px-5 py-3 shadow-2xl border transition-all duration-200 transform animate-in fade-in slide-in-from-bottom-2 ${
          isZizo
            ? 'bg-slate-900/95 border-amber-500/40 text-slate-50'
            : 'bg-slate-900/95 border-cyan-500/40 text-cyan-50'
        }`}
      >
        {/* Header with speaker badge and sound indicator */}
        <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-800 pb-1">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isZizo
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {isZizo ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              {activeLine.speakerNameAr}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {Math.floor(currentTime)}s / 30s
            </span>
          </div>

          {activeLine.soundFxCue && (
            <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/40">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>مؤثر صوتي كوميدي</span>
            </div>
          )}
        </div>

        {/* Main Arabic Egyptian Dialogue */}
        <p className="text-lg md:text-xl font-bold tracking-wide text-right leading-relaxed drop-shadow-md">
          {activeLine.textAr}
        </p>

        {/* Phonetic & English Subtitle */}
        {showEnglish && (
          <div className="mt-1 pt-1 border-t border-slate-800/70 text-xs md:text-sm text-slate-300 flex flex-col gap-0.5 text-left dir-ltr">
            <span className="italic text-slate-400">"{activeLine.phoneticEg}"</span>
            <span className="text-slate-200 font-medium">{activeLine.textEn}</span>
          </div>
        )}
      </div>
    </div>
  );
};
