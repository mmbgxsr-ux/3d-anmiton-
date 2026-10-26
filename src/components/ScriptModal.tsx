import React from 'react';
import { X, Sparkles, Bot, User, Film, Clock, Laugh } from 'lucide-react';
import { SCENES, DIALOGUE_SCRIPT } from '../data/storyScript';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTime: (time: number) => void;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({ isOpen, onClose, onJumpToTime }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-slate-950">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-amber-300">
                سيناريو الرسوم المتحركة: "مغامرة زيزو والروبوت الذكي"
              </h2>
              <p className="text-xs text-slate-400">
                فيديو كرتوني ثلاثي الأبعاد ٣٠ ثانية • ٣ مشاهد مترابطة • كوميديا مصرية مناسبة لـ YouTube Shorts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-sm">
          {/* Quick Concept Summary */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex gap-3">
            <Laugh className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-300 text-base">ملخص القصة والمفارقة الكوميدية</h3>
              <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
                طفل مصري (زيزو) يجلس أمام كشكول الرياضيات محبطاً من الواجب المدرسي الطويل، وفجأة يظهر روبوت أزرق صغير ذكي (شاطر ٣٠٠٠) متفائلاً وجاهزاً للمساعدة، ولكن المفاجأة أنه بعد فحص الكشكول بأشعة الليزر، يسأل زيزو: <span className="text-cyan-300 font-bold">"١ + ١ يساوي كام؟ وريني شطارتك وحلها أنت!"</span>، ليرد زيزو بصرخة كوميدية مصدومة: <span className="text-amber-400 font-bold">"نعــــم؟! ما لو كنت عارف ما كنتش ندهتلك يا فالح!!"</span>
              </p>
            </div>
          </div>

          {/* Character Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 flex gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg h-fit">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-300">زيزو (Zizo)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  تلميذ مصري خفيف الظل، يرتدي هودي برتقالي وبنطال جينز، يحب الألعاب ويكره مذاكرة مسائل الرياضيات الصعبة.
                </p>
              </div>
            </div>

            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5 flex gap-3">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg h-fit">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-cyan-300">روبي (شاطر ٣٠٠٠)</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  روبوت أزرق معدني لطيف، مزود بشاشة LED عيون تفاعلية، محرك مغناطيسي طائر، وليزر مسح ضوئي للكشاكيل.
                </p>
              </div>
            </div>
          </div>

          {/* Scenes Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-200 flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>المشاهد الثلاثة وحوارات الشخصيات</span>
            </h3>

            {SCENES.map((scene) => (
              <div
                key={scene.id}
                className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                      مشهد {scene.id}
                    </span>
                    <h4 className="font-bold text-slate-200">{scene.titleAr}</h4>
                  </div>
                  <button
                    onClick={() => {
                      onJumpToTime(scene.startTime);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>تشغيل المشهد ({scene.startTime}s)</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{scene.descriptionAr}</p>

                {/* Dialogue lines in this scene */}
                <div className="space-y-2 mt-2">
                  {DIALOGUE_SCRIPT.filter(
                    (d) => d.startTime >= scene.startTime && d.startTime < scene.endTime
                  ).map((line) => {
                    const isZizo = line.speaker === 'zizo';
                    return (
                      <div
                        key={line.id}
                        className={`p-2.5 rounded-lg border text-xs ${
                          isZizo
                            ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
                            : 'bg-cyan-950/20 border-cyan-800/40 text-cyan-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                          <span className={isZizo ? 'text-amber-400' : 'text-cyan-400'}>
                            {line.speakerNameAr} ({line.startTime}s - {line.endTime}s)
                          </span>
                          {line.soundFxCue && (
                            <span className="text-amber-300 font-mono flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {line.soundFxCue}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm text-slate-100 mb-0.5">{line.textAr}</p>
                        <p className="text-[11px] text-slate-400 italic">"{line.phoneticEg}"</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">{line.textEn}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            إغلاق السيناريو
          </button>
        </div>
      </div>
    </div>
  );
};
