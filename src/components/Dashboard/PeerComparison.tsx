import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Users, EyeOff } from 'lucide-react';
import { COMPETENCY_AREAS } from '../../data/competencies';
import { calcAreaScores } from '../../hooks/useAssessmentStore';
import type { EmployeeProfile, AssessmentData, AreaScore } from '../../types';

interface Props {
  currentProfile: EmployeeProfile;
  currentAreaScores: AreaScore[];
  allProfiles: EmployeeProfile[];
  allAssessments: AssessmentData[];
}

const AREA_SHORT = COMPETENCY_AREAS.map(a =>
  a.title
    .replace('Copilot in ', '')
    .replace('Copilot ', '')
    .replace(' Copilot', '')
    .substring(0, 10)
);

const MIN_PEERS = 3;

export const PeerComparison: React.FC<Props> = ({
  currentProfile,
  currentAreaScores,
  allProfiles,
  allAssessments,
}) => {
  // Find peers: same Rolle, different employee
  const peers = allProfiles.filter(
    p => p.rolle === currentProfile.rolle && p.id !== currentProfile.id
  );

  // Privacy guard: require at least MIN_PEERS colleagues
  if (peers.length < MIN_PEERS) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-800">
            Vergleich mit Kolleg:innen
          </h2>
        </div>
        <div
          className="rounded-xl p-6 flex flex-col items-center text-center gap-2"
          style={{ backgroundColor: '#f8fafc', border: '1.5px dashed #e5e7eb' }}
        >
          <EyeOff size={22} className="text-gray-300" />
          <p className="text-sm font-medium text-gray-500">
            Zu wenige Vergleichsdaten verfügbar
          </p>
          <p className="text-xs text-gray-400">
            Mindestens {MIN_PEERS} Kolleg:innen mit der Rolle „{currentProfile.rolle}"
            werden für einen anonymisierten Vergleich benötigt.
          </p>
        </div>
      </div>
    );
  }

  // Build chart data: one entry per competency area
  const chartData = COMPETENCY_AREAS.map((area, idx) => {
    // My score for this area
    const myScore =
      currentAreaScores.find(s => s.areaId === area.id)?.average ?? 0;

    // Peer averages — only include peers who have rated this area
    const peerScores = peers
      .map(p => {
        const assessment = allAssessments.find(a => a.employeeId === p.id);
        if (!assessment) return null;
        const areaScore = calcAreaScores(assessment.ratings).find(
          s => s.areaId === area.id
        );
        // Only count if they actually rated at least one use case in this area
        return areaScore && areaScore.ratingsCount > 0 ? areaScore.average : null;
      })
      .filter((v): v is number => v !== null);

    const peerAvg =
      peerScores.length > 0
        ? peerScores.reduce((a, b) => a + b, 0) / peerScores.length
        : 0;

    return {
      name: AREA_SHORT[idx],
      fullName: area.title,
      deinScore: parseFloat(myScore.toFixed(2)),
      kollegenDurchschnitt: parseFloat(peerAvg.toFixed(2)),
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: '#0d9488' }} />
          <h2 className="text-base font-semibold text-gray-800">
            Vergleich mit Kolleg:innen
          </h2>
        </div>
        <span className="text-xs text-gray-400 mt-0.5">
          {peers.length} Kolleg:innen · {currentProfile.rolle}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Anonymisierter Durchschnitt aller Kolleg:innen mit gleicher Rolle — keine
        Einzeldaten sichtbar
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
          barCategoryGap="30%"
          barGap={3}
        >
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} />
          <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toFixed(2)} / 4.0`,
              name === 'deinScore' ? 'Dein Score' : 'Ø Kolleg:innen',
            ]}
            labelFormatter={(_label, payload) =>
              payload?.[0]?.payload?.fullName ?? _label
            }
            contentStyle={{
              borderRadius: 8,
              fontSize: 11,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          />
          <Legend
            formatter={value =>
              value === 'deinScore' ? 'Dein Score' : 'Ø Kolleg:innen'
            }
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: '#6b7280' }}
          />
          <Bar
            dataKey="deinScore"
            name="deinScore"
            fill="#0d9488"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="kollegenDurchschnitt"
            name="kollegenDurchschnitt"
            fill="#cbd5e1"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
