import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SceneManager } from './three/SceneManager';
import { ControlDock } from './components/ControlDock';
import { SubtitleOverlay } from './components/SubtitleOverlay';
import { ScriptModal } from './components/ScriptModal';
import { AspectRatio, CameraViewMode } from './types';
import { SCENES } from './data/storyScript';
import { Sparkles, Tv, Smartphone, Info } from 'lucide-react';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // Player state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentSceneId, setCurrentSceneId] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('cinematic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new SceneManager(mountRef.current);
    sceneManagerRef.current = manager;

    manager.onTimeUpdate = (time: number, sceneId: number) => {
      setCurrentTime(time);
      setCurrentSceneId(sceneId);
      setIsPlaying(manager.isPlaying);
    };

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Sync aspect ratio change with canvas resize
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sceneManagerRef.current) {
        sceneManagerRef.current.onResize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [aspectRatio]);

  // Player actions
  const handlePlayPause = useCallback(() => {
    if (!sceneManagerRef.current) return;
    if (sceneManagerRef.current.isPlaying) {
      sceneManagerRef.current.pause();
      setIsPlaying(false);
    } else {
      if (sceneManagerRef.current.currentTime >= 30) {
        sceneManagerRef.current.seek(0);
      }
      sceneManagerRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (!sceneManagerRef.current) return;
    sceneManagerRef.current.restart();
    setIsPlaying(true);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    if (!sceneManagerRef.current) return;
    sceneManagerRef.current.seek(seconds);
    setCurrentTime(seconds);
  }, []);

  const handleSetSpeed = useCallback((speed: number) => {
    if (!sceneManagerRef.current) return;
    sceneManagerRef.current.setSpeed(speed);
    setPlaybackSpeed(speed);
  }, []);

  const handleSetCameraMode = useCallback((mode: CameraViewMode) => {
    if (!sceneManagerRef.current) return;
    sceneManagerRef.current.setCameraMode(mode);
    setCameraMode(mode);
  }, []);

  const handleToggleAspectRatio = useCallback(() => {
    setAspectRatio((prev) => (prev === '16:9' ? '9:16' : '16:9'));
  }, []);

  const handleTakeSnapshot = useCallback(() => {
    if (!mountRef.current) return;
    const canvas = mountRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `zizo_robot_scene_${Math.floor(currentTime)}s.png`;
      link.href = dataUrl;
      link.click();

      setSnapshotToast('تم التقاط صورة المشهد بنجاح!');
      setTimeout(() => setSnapshotToast(null), 3000);
    } catch {
      // ignore
    }
  }, [currentTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'ق') {
        handleRestart();
      } else if (e.key === '1') {
        handleSeek(0);
      } else if (e.key === '2') {
        handleSeek(10);
      } else if (e.key === '3') {
        handleSeek(20);
      } else if (e.key === 'a' || e.key === 'A') {
        handleToggleAspectRatio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleRestart, handleSeek, handleToggleAspectRatio]);

  const currentScene = SCENES.find((s) => s.id === currentSceneId) || SCENES[0];

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center select-none font-['Cairo',sans-serif]">
      {/* 3D Viewport Aspect Ratio Container */}
      <div
        className={`relative transition-all duration-300 ease-out flex items-center justify-center overflow-hidden shadow-2xl bg-black ${
          aspectRatio === '16:9'
            ? 'w-full h-full max-w-full max-h-full aspect-video'
            : 'h-[96vh] aspect-[9/16] rounded-3xl border-4 border-slate-800 shadow-cyan-950/40'
        }`}
      >
        {/* Stable Canvas Mount container outside React UI per Three.js directives */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Header Badge (Minimal & Non-intrusive) */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
          {/* Title & Current Scene Pill */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs md:text-sm font-black text-slate-100">
                مغامرة زيزو والروبوت الذكي
              </span>
              <span className="text-slate-500 font-mono text-xs">|</span>
              <span className="text-xs text-amber-400 font-bold truncate max-w-[150px] md:max-w-none">
                {currentScene.titleAr}
              </span>
            </div>
          </div>

          {/* Quick Info & Aspect Pill */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsScriptModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition shadow-lg"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">تفاصيل القصة</span>
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300">
              {aspectRatio === '16:9' ? <Tv className="w-3 h-3 text-cyan-400" /> : <Smartphone className="w-3 h-3 text-amber-400" />}
              <span>{aspectRatio}</span>
            </div>
          </div>
        </div>

        {/* Animated Subtitle Overlay */}
        <SubtitleOverlay
          currentTime={currentTime}
          showEnglish={showEnglish}
          visible={showSubtitles}
        />

        {/* Snapshot Success Toast */}
        {snapshotToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">
            {snapshotToast}
          </div>
        )}
      </div>

      {/* Collapsible Bottom Control Dock per Three.js directives */}
      <ControlDock
        currentTime={currentTime}
        currentSceneId={currentSceneId}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        cameraMode={cameraMode}
        aspectRatio={aspectRatio}
        showSubtitles={showSubtitles}
        showEnglish={showEnglish}
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
        onSeek={handleSeek}
        onSetSpeed={handleSetSpeed}
        onSetCameraMode={handleSetCameraMode}
        onToggleAspectRatio={handleToggleAspectRatio}
        onToggleSubtitles={() => setShowSubtitles(!showSubtitles)}
        onToggleEnglish={() => setShowEnglish(!showEnglish)}
        onOpenScriptModal={() => setIsScriptModalOpen(true)}
        onTakeSnapshot={handleTakeSnapshot}
      />

      {/* Script & Storyboard Modal */}
      <ScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        onJumpToTime={(t) => {
          handleSeek(t);
          if (!isPlaying) handlePlayPause();
        }}
      />
    </div>
  );
}
