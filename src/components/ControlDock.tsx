import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  Subtitles,
  Smartphone,
  Tv,
  BookOpen,
  CameraIcon
} from 'lucide-react';
import { CameraViewMode, AspectRatio } from '../types';
import { SCENES } from '../data/storyScript';
import { soundEngine } from '../audio/soundEngine';

interface ControlDockProps {
  currentTime: number;
  currentSceneId: number;
  isPlaying: boolean;
  playbackSpeed: number;
  cameraMode: CameraViewMode;
  aspectRatio: AspectRatio;
  showSubtitles: boolean;
  showEnglish: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onSeek: (seconds: number) => void;
  onSetSpeed: (speed: number) => void;
  onSetCameraMode: (mode: CameraViewMode) => void;
  onToggleAspectRatio: () => void;
  onToggleSubtitles: () => void;
  onToggleEnglish: () => void;
  onOpenScriptModal: () => void;
  onTakeSnapshot: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  currentTime,
  currentSceneId,
  isPlaying,
  playbackSpeed,
  cameraMode,
  aspectRatio,
  showSubtitles,
  showEnglish,
  onPlayPause,
  onRestart,
  onSeek,
  onSetSpeed,
  onSetCameraMode,
  onToggleAspectRatio,
  onToggleSubtitles,
  onToggleEnglish,
  onOpenScriptModal,
  onTakeSnapshot,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [activeTab, setActiveTab] = useState<'timeline' | 'camera' | 'audio'>('timeline');

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 w-[95vw] max-w-[940px] pointer-events-auto ${
        isCollapsed ? 'bottom-2' : 'bottom-4'
      }`}
    >
      {/* Collapse / Expand Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 border border-slate-700/80 rounded-t-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-lg"
          title="تبديل وضع السينما (اختصار H)"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>إظهار لوحة التحكم</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>وضع السينما (إخفاء اللوحة)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container - Solid surface, no backdrop-filter per skill directives */}
      {!isCollapsed && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-3 md:p-4 shadow-2xl text-slate-100 flex flex-col gap-3">
          {/* Top Sub-bar: Scene Markers & Timeline Slider */}
          <div className="flex flex-col gap-1.5">
            {/* Scene Segment Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {SCENES.map((scene) => {
                const isActive = currentSceneId === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => onSeek(scene.startTime)}
                    className={`flex flex-col items-start px-2.5 py-1.5 rounded-lg text-xs transition border text-right ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold">{scene.titleAr.split(':')[0]}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {scene.startTime}s - {scene.endTime}s
                      </span>
                    </div>
                    <span className="text-[11px] truncate w-full text-slate-300">
                      {scene.titleAr.split(':')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Timeline Progress Scrubber */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono font-bold text-cyan-400 min-w-[58px]">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
                {/* 10s and 20s visual scene divider notches */}
                <div className="absolute left-[33.33%] top-0 bottom-0 w-0.5 bg-slate-600 pointer-events-none" />
                <div className="absolute left-[66.66%] top-0 bottom-0 w-0.5 bg-slate-600 pointer-events-none" />
              </div>

              <span className="text-xs font-mono text-slate-400 min-w-[50px] text-left">
                00:30.0
              </span>
            </div>
          </div>

          {/* Bottom Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
            {/* Playback Transport Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="إعادة التشغيل من البداية"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onPlayPause}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition shadow-md"
                title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الفيديو'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span className="text-xs">{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
              </button>

              {/* Speed Multipliers */}
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 text-xs">
                {[0.5, 1.0, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => onSetSpeed(speed)}
                    className={`px-2 py-1 rounded-lg font-mono font-medium transition ${
                      playbackSpeed === speed
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl transition ${
                  isMuted
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center: Camera Angle Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs">
              <Camera className="w-3.5 h-3.5 text-slate-400 mx-1 hidden sm:block" />
              {[
                { id: 'cinematic', label: 'المخرج' },
                { id: 'zizo', label: 'زيزو' },
                { id: 'roby', label: 'روبي' },
                { id: 'wide', label: 'واسع' },
                { id: 'orbit', label: 'حر 3D' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSetCameraMode(c.id as CameraViewMode)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                    cameraMode === c.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Right: Aspect Ratio & Tools */}
            <div className="flex items-center gap-1.5">
              {/* Aspect Ratio Toggle (16:9 Cinema vs 9:16 Shorts) */}
              <button
                onClick={onToggleAspectRatio}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                title="تبديل نسبة العرض (16:9 سينمائي أو 9:16 شورتس)"
              >
                {aspectRatio === '16:9' ? <Tv className="w-3.5 h-3.5 text-cyan-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
                <span>{aspectRatio}</span>
              </button>

              {/* Subtitles & English Toggle */}
              <button
                onClick={onToggleSubtitles}
                className={`p-2 rounded-xl transition ${
                  showSubtitles
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="تبديل الترجمة والحوار"
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Script / Story Modal */}
              <button
                onClick={onOpenScriptModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                title="عرض النص والسيناريو المصري الكامل"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">السيناريو</span>
              </button>

              {/* Snapshot Button */}
              <button
                onClick={onTakeSnapshot}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="التقاط صورة سينمائية عالية الدقة"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
