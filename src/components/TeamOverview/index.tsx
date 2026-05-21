import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { Download, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { COMPETENCY_AREAS } from '../../data/competencies';
import { calcAreaScores, calcOverallAverage, getMaturityBadge } from '../../hooks/useAssessmentStore';
import { exportTeamCsv } from '../../utils/csvExport';
import type { EmployeeProfile, AssessmentData, UserRole } from '../../types';

interface Props {
  teamProfiles: EmployeeProfile[];
  allAssessments: AssessmentData[];
  userRole?: UserRole;
  userDepartment?: string;
}

function heatmapColor(score: number | null): string {
  if (score === null) return '#f3f4f6';
  if (score >= 3.5) return '#059669';
  if (score >= 2.5) return '#34d399';
  if (score >= 1.5) return '#fb923c';
  if (score >= 0.5) return '#f87171';
  return '#d1d5db';
}

function heatmapTextColor(score: number | null): string {
  if (score === null) return '#9ca3af';
  if (score >= 2.5) return '#fff';
  return '#fff';
}

const AREA_SHORT_LABELS = COMPETENCY_AREAS.map((a) =>
  a.title.replace('Copilot in ', '').replace('Copilot ', '').replace(' Copilot', '').substring(0, 12)
);

type SortKey = 'name' | 'overall' | string;
type SortDir = 'asc' | 'desc';

export const TeamOverview: React.FC<Props> = ({
  teamProfiles,
  allAssessments,
  userRole,
  userDepartment,
}) => {
  // Teamleiter: pre-filter to their department (locked); HR: free choice
  const isTeamleiter = userRole === 'Teamleiter';
  const [filterAbteilung, setFilterAbteilung] = useState(
    isTeamleiter && userDepartment ? userDepartment : ''
  );
  const [filterRolle, setFilterRolle] = useState('');
  const [filterZeitraum, setFilterZeitraum] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const uniqueAbteilungen = [...new Set(teamProfiles.map((p) => p.abteilung))].sort();
  const uniqueRollen = [...new Set(teamProfiles.map((p) => p.rolle))].sort();
  const uniqueZeitraeume = [...new Set(teamProfiles.map((p) => p.bewertungszeitraum))].sort();

  const filteredProfiles = useMemo(() => {
    return teamProfiles.filter((p) => {
      if (filterAbteilung && p.abteilung !== filterAbteilung) return false;
      if (filterRolle && p.rolle !== filterRolle) return false;
      if (filterZeitraum && p.bewertungszeitraum !== filterZeitraum) return false;
      return true;
    });
  }, [teamProfiles, filterAbteilung, filterRolle, filterZeitraum]);

  // Build row data
  const rowData = useMemo(() => {
    return filteredProfiles.map((profile) => {
      const assessment = allAssessments.find((a) => a.employeeId === profile.id);
      const areaScores = assessment ? calcAreaScores(assessment.ratings) : [];
      const overall = assessment ? calcOverallAverage(assessment.ratings) : 0;
      const areaMap: Record<string, number | null> = {};
      COMPETENCY_AREAS.forEach((area) => {
        const score = areaScores.find((s) => s.areaId === area.id);
        areaMap[area.id] = score && score.ratingsCount > 0 ? score.average : null;
      });
      return { profile, areaMap, overall };
    });
  }, [filteredProfiles, allAssessments]);

  // Sort
  const sortedRows = useMemo(() => {
    return [...rowData].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;
      if (sortKey === 'name') {
        valA = a.profile.nachname;
        valB = b.profile.nachname;
        return sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }
      if (sortKey === 'overall') {
        valA = a.overall;
        valB = b.overall;
      } else {
        valA = a.areaMap[sortKey] ?? -1;
        valB = b.areaMap[sortKey] ?? -1;
      }
      return sortDir === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [rowData, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null;

  // Department aggregates for bar chart
  const deptAggregates = useMemo(() => {
    const deptMap: Record<string, number[][]> = {};
    rowData.forEach(({ profile, areaMap }) => {
      if (!deptMap[profile.abteilung]) deptMap[profile.abteilung] = COMPETENCY_AREAS.map(() => []);
      COMPETENCY_AREAS.forEach((area, idx) => {
        const v = areaMap[area.id];
        if (v !== null && v !== undefined) deptMap[profile.abteilung][idx].push(v);
      });
    });

    return Object.entries(deptMap).map(([dept, areaCols]) => {
      const entry: Record<string, number | string> = { dept: dept.substring(0, 8) };
      areaCols.forEach((vals, idx) => {
        entry[AREA_SHORT_LABELS[idx]] =
          vals.length > 0 ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) : 0;
      });
      return entry;
    });
  }, [rowData]);

  // Dept aggregate row for heatmap
  const deptAvgRow = useMemo(() => {
    const areaMap: Record<string, number | null> = {};
    COMPETENCY_AREAS.forEach((area) => {
      const vals = rowData.map((r) => r.areaMap[area.id]).filter((v): v is number => v !== null);
      areaMap[area.id] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    });
    const overallVals = rowData.map((r) => r.overall);
    return { areaMap, overall: overallVals.length > 0 ? overallVals.reduce((a, b) => a + b, 0) / overallVals.length : 0 };
  }, [rowData]);

  const thClass = 'px-2 py-2 text-left text-xs font-semibold text-gray-500 whitespace-nowrap cursor-pointer hover:text-gray-800 select-none';
  const cellClass = 'px-2 py-2 text-center';

  const CHART_COLORS = ['#0d9488', '#1e3a5f', '#60a5fa', '#34d399', '#fb923c', '#a78bfa', '#f472b6', '#fbbf24'];

  return (
    <div className="p-4 md:p-6 max-w-full view-transition">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Team-Überblick</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredProfiles.length} Mitarbeiter:innen</p>
        </div>
        <button
          onClick={() => exportTeamCsv(filteredProfiles, allAssessments)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <Download size={16} /> Exportieren (CSV)
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-xl mb-6"
        style={{ backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}
      >
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-600">Filter:</span>
        </div>

        {/* Abteilung: locked chip for Teamleiter, dropdown for HR */}
        {isTeamleiter ? (
          <span
            className="text-xs px-3 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }}
          >
            {userDepartment ?? 'Meine Abteilung'}
          </span>
        ) : (
          <select
            value={filterAbteilung}
            onChange={(e) => setFilterAbteilung(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            <option value="">Alle Abteilungen</option>
            {uniqueAbteilungen.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}

        {[
          { label: 'Rolle', value: filterRolle, options: uniqueRollen, set: setFilterRolle },
          { label: 'Zeitraum', value: filterZeitraum, options: uniqueZeitraeume, set: setFilterZeitraum },
        ].map(({ label, value, options, set }) => (
          <select
            key={label}
            value={value}
            onChange={(e) => set(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            <option value="">Alle {label}en</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}

        {!isTeamleiter && (filterAbteilung || filterRolle || filterZeitraum) && (
          <button
            onClick={() => { setFilterAbteilung(''); setFilterRolle(''); setFilterZeitraum(''); }}
            className="text-xs px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            Filter zurücksetzen
          </button>
        )}
        {isTeamleiter && (filterRolle || filterZeitraum) && (
          <button
            onClick={() => { setFilterRolle(''); setFilterZeitraum(''); }}
            className="text-xs px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Heatmap table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f' }}>
              <th
                className={thClass + ' sticky left-0 z-10 text-white bg-transparent'}
                style={{ backgroundColor: '#1e3a5f', minWidth: 160 }}
                onClick={() => handleSort('name')}
              >
                <span className="inline-flex items-center gap-1">
                  Mitarbeiter:in <SortIcon k="name" />
                </span>
              </th>
              {COMPETENCY_AREAS.map((area, idx) => (
                <th
                  key={area.id}
                  className={thClass + ' text-center text-white bg-transparent'}
                  onClick={() => handleSort(area.id)}
                  title={area.title}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {AREA_SHORT_LABELS[idx]} <SortIcon k={area.id} />
                  </span>
                </th>
              ))}
              <th
                className={thClass + ' text-center text-white bg-transparent font-bold'}
                onClick={() => handleSort('overall')}
              >
                <span className="inline-flex items-center gap-1">Ø Gesamt <SortIcon k="overall" /></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(({ profile, areaMap, overall }) => {
              const badge = getMaturityBadge(overall);
              return (
                <tr key={profile.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-3 py-2 sticky left-0 bg-white z-10">
                    <div className="font-medium text-gray-800">
                      {profile.nachname}, {profile.vorname.charAt(0)}.
                    </div>
                    <div className="text-gray-400">{profile.rolle} · {profile.abteilung.substring(0, 8)}</div>
                  </td>
                  {COMPETENCY_AREAS.map((area) => {
                    const score = areaMap[area.id];
                    return (
                      <td key={area.id} className={cellClass}>
                        <div
                          className="mx-auto w-10 h-7 rounded flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: heatmapColor(score),
                            color: heatmapTextColor(score),
                          }}
                        >
                          {score !== null ? score.toFixed(1) : '–'}
                        </div>
                      </td>
                    );
                  })}
                  <td className={cellClass}>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: badge.bgColor, color: badge.color.replace('text-', '') }}
                    >
                      {badge.emoji} {overall.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Aggregate row */}
            {sortedRows.length > 0 && (
              <tr style={{ backgroundColor: '#f0f4f8' }} className="font-semibold">
                <td className="px-3 py-2 sticky left-0 z-10" style={{ backgroundColor: '#f0f4f8' }}>
                  <div className="text-xs font-bold text-gray-600">⌀ Team-Durchschnitt</div>
                </td>
                {COMPETENCY_AREAS.map((area) => {
                  const score = deptAvgRow.areaMap[area.id];
                  return (
                    <td key={area.id} className={cellClass}>
                      <div
                        className="mx-auto w-10 h-7 rounded flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: heatmapColor(score),
                          color: heatmapTextColor(score),
                        }}
                      >
                        {score !== null ? score.toFixed(1) : '–'}
                      </div>
                    </td>
                  );
                })}
                <td className={cellClass}>
                  <span className="text-xs font-bold text-gray-700">
                    {deptAvgRow.overall.toFixed(1)}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {sortedRows.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            Keine Mitarbeiter:innen gefunden.
          </div>
        )}
      </div>

      {/* Bar chart */}
      {deptAggregates.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Abteilungsvergleich nach Bereich
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={deptAggregates}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 4]} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name) => [`${Number(value).toFixed(2)}`, String(name)]}
                contentStyle={{ borderRadius: 8, fontSize: 11, border: '1px solid #e5e7eb' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              {AREA_SHORT_LABELS.map((label, idx) => (
                <Bar key={label} dataKey={label} fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[2, 2, 0, 0]}>
                  {deptAggregates.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
