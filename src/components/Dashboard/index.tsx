import React, { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  TrendingUp, TrendingDown, ChevronRight, Target, Award, BarChart3, CheckCircle2,
} from 'lucide-react';
import { ProgressBar }    from '../shared/ProgressBar';
import { ScoreDisplay }   from '../shared/ScoreDisplay';
import { PeerComparison } from './PeerComparison';
import { LEVEL_COLORS }   from '../../data/competencies';
import type { AreaScore, EmployeeProfile, MaturityBadge, AssessmentData, UserRole } from '../../types';

interface Props {
  profile: EmployeeProfile;
  areaScores: AreaScore[];
  overallAverage: number;
  maturityBadge: MaturityBadge;
  totalRated: number;
  pctLevel2Plus: number;
  pctLevel3Plus: number;
  strengths: AreaScore[];
  gaps: AreaScore[];
  onNavigateToAssessment: (areaId?: string) => void;
  isLoading?: boolean;
  // Auth-aware additions
  userRole?: UserRole;
  allProfiles?: EmployeeProfile[];
  allAssessments?: AssessmentData[];
}

function scoreColor(score: number): string {
  if (score >= 4) return LEVEL_COLORS[4];
  if (score >= 3) return LEVEL_COLORS[3];
  if (score >= 2) return LEVEL_COLORS[2];
  if (score >= 1) return LEVEL_COLORS[1];
  return LEVEL_COLORS[0];
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 shadow-sm">
    <div className="skeleton h-4 w-32 mb-3" />
    <div className="skeleton h-8 w-20 mb-2" />
    <div className="skeleton h-2 w-full rounded" />
  </div>
);

export const Dashboard: React.FC<Props> = ({
  profile,
  areaScores,
  overallAverage,
  maturityBadge,
  totalRated,
  pctLevel2Plus,
  pctLevel3Plus,
  strengths,
  gaps,
  onNavigateToAssessment,
  isLoading = false,
  userRole,
  allProfiles,
  allAssessments,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const radarData = areaScores.map(s => ({
    subject: s.areaTitle
      .replace('Copilot in ', '')
      .replace('Copilot ', '')
      .replace(' Copilot', ''),
    score: parseFloat(s.average.toFixed(2)),
    fullMark: 4,
  }));

  const hasData = totalRated > 0;
  const showPeerComparison =
    !!userRole && !!allProfiles && !!allAssessments && hasData;

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto view-transition">

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 mb-6 text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4f7c 60%, #1e3a5f 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm opacity-70 mb-1">{profile.bewertungszeitraum}</p>
            <h1 className="text-2xl font-bold mb-1">Guten Tag, {profile.vorname}!</h1>
            <p className="text-sm opacity-75">{profile.rolle} · {profile.abteilung}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-5xl font-bold leading-none">
                {overallAverage.toFixed(1)}
              </div>
              <div className="text-sm opacity-70">/ 4.0 Gesamt</div>
            </div>
            <div
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
            >
              {maturityBadge.emoji} {maturityBadge.label}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Bewertet',  value: `${totalRated}/36`,    icon: CheckCircle2, color: '#0d9488' },
          { label: 'Level ≥ 2', value: `${pctLevel2Plus}%`,   icon: BarChart3,    color: '#60a5fa' },
          { label: 'Level ≥ 3', value: `${pctLevel3Plus}%`,   icon: Award,        color: '#34d399' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: color + '18' }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-800">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {!hasData && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center mb-6">
          <Target size={40} className="mx-auto mb-3 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Noch keine Bewertungen
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Starte deine Selbsteinschätzung, um deinen Entwicklungsstand zu sehen.
          </p>
          <button
            onClick={() => onNavigateToAssessment()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm transition hover:opacity-90"
            style={{ backgroundColor: '#0d9488' }}
          >
            Jetzt bewerten <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* ── Radar + area detail ───────────────────────────────────────── */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Kompetenz-Übersicht
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#0d9488"
                  fill="#0d9488"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip
                  formatter={value => [`${Number(value).toFixed(1)} / 4.0`, 'Ø Score']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Area detail */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Bereiche im Detail
            </h2>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 280 }}>
              {areaScores.map(area => (
                <div
                  key={area.areaId}
                  className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                  onMouseEnter={() => setHoveredArea(area.areaId)}
                  onMouseLeave={() => setHoveredArea(null)}
                  onClick={() => onNavigateToAssessment(area.areaId)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">
                      {area.areaTitle}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">
                        {area.ratingsCount}/{area.totalUseCases}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: scoreColor(area.average) }}
                      >
                        {area.average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    value={(area.average / 4) * 100}
                    color={scoreColor(area.average)}
                    height={6}
                  />
                  {hoveredArea === area.areaId && (
                    <p className="text-xs text-teal-600 mt-1">
                      {Math.round(area.pctLevel2Plus)}% auf Level ≥ 2
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Peer comparison (all roles; privacy guard is inside component) ─ */}
      {showPeerComparison && (
        <div className="mb-6">
          <PeerComparison
            currentProfile={profile}
            currentAreaScores={areaScores}
            allProfiles={allProfiles!}
            allAssessments={allAssessments!}
          />
        </div>
      )}

      {/* ── Strengths / Gaps ─────────────────────────────────────────── */}
      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{ color: '#34d399' }} />
              <h2 className="text-base font-semibold text-gray-800">Meine Stärken</h2>
            </div>
            <div className="space-y-3">
              {strengths.map((area, i) => (
                <div key={area.areaId} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: '#34d399' }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {area.areaTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ProgressBar
                        value={(area.average / 4) * 100}
                        color={scoreColor(area.average)}
                        height={4}
                      />
                      <ScoreDisplay score={area.average} size="sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={18} style={{ color: '#fb923c' }} />
              <h2 className="text-base font-semibold text-gray-800">
                Entwicklungspotenzial
              </h2>
            </div>
            <div className="space-y-3">
              {gaps.map(area => (
                <div key={area.areaId} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {area.areaTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <ProgressBar
                        value={(area.average / 4) * 100}
                        color={scoreColor(area.average)}
                        height={4}
                      />
                      <ScoreDisplay score={area.average} size="sm" />
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateToAssessment(area.areaId)}
                    className="shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition hover:opacity-80"
                    style={{ backgroundColor: '#fff3e8', color: '#c2410c' }}
                  >
                    Verbessern <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
