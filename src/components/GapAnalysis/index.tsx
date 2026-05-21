import React, { useState, useCallback } from 'react';
import { ExternalLink, Download, Target, ChevronRight, Pencil, Check, X } from 'lucide-react';
import { LevelBadge } from '../shared/LevelBadge';
import { COMPETENCY_AREAS } from '../../data/competencies';
import { exportGapListCsv } from '../../utils/csvExport';
import type { EmployeeProfile, AssessmentData, UserRole } from '../../types';

const RESOURCE_OVERRIDES_KEY = 'km_resource_overrides';

function loadOverrides(): Record<number, string> {
  try {
    const raw = localStorage.getItem(RESOURCE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<number, string>) {
  localStorage.setItem(RESOURCE_OVERRIDES_KEY, JSON.stringify(overrides));
}

interface GapItem {
  area: typeof COMPETENCY_AREAS[number];
  uc: typeof COMPETENCY_AREAS[number]['useCases'][number];
  level: number;
}

interface Props {
  profile: EmployeeProfile;
  assessment: AssessmentData;
  gapUseCases: GapItem[];
  onNavigateToAssessment: (areaId?: string) => void;
  userRole?: UserRole;
}

export const GapAnalysis: React.FC<Props> = ({
  profile,
  assessment,
  gapUseCases,
  onNavigateToAssessment,
  userRole,
}) => {
  const isHR = userRole === 'HR';
  const [overrides, setOverrides] = useState<Record<number, string>>(loadOverrides);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = useCallback((ucId: number, currentUrl: string) => {
    setEditingId(ucId);
    setEditValue(currentUrl);
  }, []);

  const commitEdit = useCallback((ucId: number) => {
    const trimmed = editValue.trim();
    const next = { ...overrides };
    if (trimmed) next[ucId] = trimmed;
    else delete next[ucId];
    setOverrides(next);
    saveOverrides(next);
    setEditingId(null);
  }, [editValue, overrides]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue('');
  }, []);
  // Group gaps by area
  const gapsByArea: Record<string, GapItem[]> = {};
  gapUseCases.forEach((item) => {
    if (!gapsByArea[item.area.id]) gapsByArea[item.area.id] = [];
    gapsByArea[item.area.id].push(item);
  });

  const totalGaps = gapUseCases.length;

  if (totalGaps === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto view-transition">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#d1fae5' }}
          >
            <Target size={28} style={{ color: '#059669' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Alle Bereiche gut aufgestellt!</h2>
          <p className="text-sm text-gray-500">
            Du hast alle Use Cases auf Level 2 oder höher bewertet. Weiter so!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto view-transition">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Entwicklungsplan</h1>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-semibold text-orange-600">{totalGaps} von 36 Use Cases</span> haben
            Entwicklungspotenzial (Level 0 oder 1)
          </p>
        </div>
        <button
          onClick={() => exportGapListCsv(profile, assessment)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Download size={16} /> Exportieren (CSV)
        </button>
      </div>

      {/* Summary bar */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center gap-4"
        style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#fb923c20' }}
        >
          <Target size={22} style={{ color: '#ea580c' }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-orange-800">Empfohlener nächster Schritt</p>
          <p className="text-xs text-orange-700 mt-0.5">
            Für alle Use Cases gilt: <strong>Level 2 (Mit Anleitung)</strong> als erstes Ziel —
            Schritt-für-Schritt mit Unterstützung üben.
          </p>
        </div>
      </div>

      {/* Gaps by area */}
      <div className="space-y-6">
        {Object.entries(gapsByArea).map(([areaId, items]) => {
          const area = COMPETENCY_AREAS.find((a) => a.id === areaId)!;
          return (
            <div key={areaId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Area header */}
              <div
                className="flex items-center justify-between px-5 py-3 border-b border-gray-100"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <h3 className="text-sm font-semibold text-gray-700">{area.title}</h3>
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                  {items.length} Lücke{items.length !== 1 ? 'n' : ''}
                </span>
              </div>

              {/* Use cases */}
              <div className="divide-y divide-gray-50">
                {items.map(({ uc, level }) => (
                  <div key={uc.id} className="px-5 py-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-xs font-bold text-gray-400 mt-0.5 shrink-0 w-6">
                          {uc.id}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{uc.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <LevelBadge level={level} showLabel size="sm" />
                            <ChevronRight size={12} className="text-gray-300" />
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
                            >
                              Ziel: Level 2
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {/* Resource URL: editable for HR, link for everyone */}
                        {isHR && editingId === uc.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="url"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder="https://learn.microsoft.com/..."
                              className="text-xs px-2 py-1.5 rounded-lg border border-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-400 w-52"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') commitEdit(uc.id);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => commitEdit(uc.id)}
                              className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 transition"
                              title="Speichern"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                              title="Abbrechen"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <a
                              href={overrides[uc.id] ?? uc.microsoftLearnUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition hover:opacity-80"
                              style={{ backgroundColor: '#e6f4f3', color: '#0d9488' }}
                            >
                              <ExternalLink size={12} />
                              Microsoft Learn
                            </a>
                            {isHR && (
                              <button
                                onClick={() =>
                                  startEdit(uc.id, overrides[uc.id] ?? uc.microsoftLearnUrl)
                                }
                                className="p-1.5 rounded-lg text-gray-300 hover:text-teal-600 hover:bg-teal-50 transition"
                                title="URL bearbeiten"
                              >
                                <Pencil size={12} />
                              </button>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => onNavigateToAssessment(areaId)}
                          className="inline-flex items-center gap-1 text-xs px-3 py-2 rounded-lg font-medium transition hover:opacity-80"
                          style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                        >
                          Bewerten
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
