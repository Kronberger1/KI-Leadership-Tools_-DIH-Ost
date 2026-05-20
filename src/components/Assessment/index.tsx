import React, { useState, useCallback } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, ExternalLink, MessageSquare, Link2 } from 'lucide-react';
import { COMPETENCY_AREAS, LEVEL_LABELS, LEVEL_COLORS } from '../../data/competencies';
import { ProgressBar } from '../shared/ProgressBar';
import type { Level } from '../../types';

interface Props {
  initialAreaId?: string;
  getRating: (useCaseId: number) => { level: Level; evidence?: string; comment?: string } | undefined;
  saveRating: (useCaseId: number, level: Level, evidence?: string, comment?: string) => void;
}

const LEVEL_BUTTON_LABELS: Record<number, string> = {
  0: '0 – Unbekannt',
  1: '1 – Kennt Use Case',
  2: '2 – Mit Anleitung',
  3: '3 – Selbstständig',
  4: '4 – Optimiert',
};

export const Assessment: React.FC<Props> = ({ initialAreaId, getRating, saveRating }) => {
  const initialIdx = initialAreaId
    ? Math.max(0, COMPETENCY_AREAS.findIndex((a) => a.id === initialAreaId))
    : 0;

  const [activeAreaIdx, setActiveAreaIdx] = useState(initialIdx);
  const [expandedUc, setExpandedUc] = useState<number | null>(null);
  const [pendingEvidence, setPendingEvidence] = useState<Record<number, string>>({});
  const [pendingComment, setPendingComment] = useState<Record<number, string>>({});

  const activeArea = COMPETENCY_AREAS[activeAreaIdx];

  const areaRatedCount = activeArea.useCases.filter((uc) => {
    const r = getRating(uc.id);
    return r !== undefined;
  }).length;

  const areaAverage = (() => {
    const ratings = activeArea.useCases
      .map((uc) => getRating(uc.id)?.level)
      .filter((l): l is Level => l !== undefined);
    if (ratings.length === 0) return null;
    return ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
  })();

  const handleLevelSelect = useCallback(
    (useCaseId: number, level: Level) => {
      const existing = getRating(useCaseId);
      const evidence = pendingEvidence[useCaseId] ?? existing?.evidence ?? '';
      const comment = pendingComment[useCaseId] ?? existing?.comment ?? '';
      saveRating(useCaseId, level, evidence, comment);
    },
    [getRating, pendingEvidence, pendingComment, saveRating]
  );

  const handleEvidenceSave = (useCaseId: number) => {
    const existing = getRating(useCaseId);
    if (existing) {
      saveRating(
        useCaseId,
        existing.level,
        pendingEvidence[useCaseId] ?? existing.evidence ?? '',
        pendingComment[useCaseId] ?? existing.comment ?? ''
      );
    }
  };

  const completionPct = (areaRatedCount / activeArea.useCases.length) * 100;

  return (
    <div className="flex h-full min-h-screen view-transition" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="p-4 border-b border-gray-100"
          style={{ background: 'linear-gradient(180deg, #1e3a5f 0%, #2a4f7c 100%)' }}
        >
          <h2 className="text-sm font-semibold text-white">Selbsteinschätzung</h2>
          <p className="text-xs opacity-60 text-white mt-0.5">9 Bereiche · 36 Use Cases</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {COMPETENCY_AREAS.map((area, idx) => {
            const ratedInArea = area.useCases.filter((uc) => {
              const r = getRating(uc.id);
              return r !== undefined;
            }).length;
            const isActive = idx === activeAreaIdx;
            const isComplete = ratedInArea === area.useCases.length;

            return (
              <button
                key={area.id}
                onClick={() => setActiveAreaIdx(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 ${
                  isActive ? 'shadow-sm' : 'hover:bg-gray-50'
                }`}
                style={
                  isActive
                    ? { backgroundColor: '#e6f4f3', color: '#0d9488' }
                    : { color: '#374151' }
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium leading-tight">{area.title}</span>
                  {isComplete && (
                    <CheckCircle2 size={14} style={{ color: '#34d399', flexShrink: 0 }} />
                  )}
                </div>
                <div className="mt-1.5">
                  <ProgressBar
                    value={(ratedInArea / area.useCases.length) * 100}
                    color={isActive ? '#0d9488' : '#94a3b8'}
                    height={3}
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {ratedInArea} / {area.useCases.length}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Area header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-gray-800">{activeArea.title}</h1>
              <div className="flex items-center gap-2">
                {areaAverage !== null && (
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: LEVEL_COLORS[Math.round(areaAverage)] + '20',
                      color: LEVEL_COLORS[Math.round(areaAverage)],
                    }}
                  >
                    Ø {areaAverage.toFixed(1)}
                  </span>
                )}
                <span className="text-sm text-gray-500">{areaRatedCount} / {activeArea.useCases.length} bewertet</span>
              </div>
            </div>
            <ProgressBar value={completionPct} color="#0d9488" height={6} />
          </div>

          {/* Use cases */}
          <div className="space-y-4">
            {activeArea.useCases.map((uc) => {
              const rating = getRating(uc.id);
              const currentLevel = rating?.level;
              const isExpanded = expandedUc === uc.id;

              return (
                <div
                  key={uc.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
                >
                  {/* Use case header */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <span
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor:
                            currentLevel !== undefined
                              ? LEVEL_COLORS[currentLevel] + '20'
                              : '#f3f4f6',
                          color:
                            currentLevel !== undefined ? LEVEL_COLORS[currentLevel] : '#9ca3af',
                        }}
                      >
                        {uc.id}
                      </span>
                      <p className="text-sm font-medium text-gray-800 leading-snug">{uc.title}</p>
                    </div>

                    {/* Level selector */}
                    <div className="flex flex-wrap gap-2">
                      {([0, 1, 2, 3, 4] as Level[]).map((level) => {
                        const isSelected = currentLevel === level;
                        const color = LEVEL_COLORS[level];
                        return (
                          <button
                            key={level}
                            onClick={() => handleLevelSelect(uc.id, level)}
                            title={LEVEL_LABELS[level]}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border"
                            style={{
                              backgroundColor: isSelected ? color + '22' : 'transparent',
                              borderColor: isSelected ? color : '#e5e7eb',
                              color: isSelected ? color : '#6b7280',
                              boxShadow: isSelected ? `0 0 0 1px ${color}` : 'none',
                              transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            {LEVEL_BUTTON_LABELS[level]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Expand / collapse for evidence */}
                    <button
                      onClick={() => setExpandedUc(isExpanded ? null : uc.id)}
                      className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 transition"
                    >
                      {isExpanded ? (
                        <>Felder ausblenden <ChevronLeft size={12} /></>
                      ) : (
                        <>Nachweis & Kommentar <ChevronRight size={12} /></>
                      )}
                    </button>
                  </div>

                  {/* Expanded: evidence + comment */}
                  {isExpanded && (
                    <div
                      className="border-t border-gray-100 p-4 space-y-3"
                      style={{ backgroundColor: '#f8fafc' }}
                    >
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                          <Link2 size={12} /> Nachweis (URL, Dateiname, Notiz)
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                          placeholder="z.B. https://... oder 'Demo im Meeting vom 12.5.'"
                          value={pendingEvidence[uc.id] ?? rating?.evidence ?? ''}
                          onChange={(e) =>
                            setPendingEvidence((prev) => ({ ...prev, [uc.id]: e.target.value }))
                          }
                          onBlur={() => handleEvidenceSave(uc.id)}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                          <MessageSquare size={12} /> Kommentar (optional)
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                          rows={2}
                          placeholder="Eigene Anmerkungen..."
                          value={pendingComment[uc.id] ?? rating?.comment ?? ''}
                          onChange={(e) =>
                            setPendingComment((prev) => ({ ...prev, [uc.id]: e.target.value }))
                          }
                          onBlur={() => handleEvidenceSave(uc.id)}
                        />
                      </div>
                      <a
                        href={uc.microsoftLearnUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:underline"
                      >
                        <ExternalLink size={11} /> Microsoft Learn Ressource
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setActiveAreaIdx((i) => Math.max(0, i - 1))}
              disabled={activeAreaIdx === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} /> Vorheriger Bereich
            </button>
            <button
              onClick={() => setActiveAreaIdx((i) => Math.min(COMPETENCY_AREAS.length - 1, i + 1))}
              disabled={activeAreaIdx === COMPETENCY_AREAS.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: '#0d9488' }}
            >
              Nächster Bereich <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
