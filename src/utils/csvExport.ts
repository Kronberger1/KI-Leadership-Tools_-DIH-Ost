import { COMPETENCY_AREAS } from '../data/competencies';
import type { EmployeeProfile, AssessmentData } from '../types';
import { calcAreaScores } from '../hooks/useAssessmentStore';

function escapeCsv(val: string | number | undefined): string {
  if (val === undefined || val === null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportGapListCsv(
  profile: EmployeeProfile,
  assessment: AssessmentData
): void {
  const rows: string[] = [
    ['Bereich', 'Use Case ID', 'Use Case', 'Aktuelles Level', 'Ziel Level', 'Microsoft Learn URL'].join(','),
  ];

  COMPETENCY_AREAS.forEach((area) => {
    area.useCases.forEach((uc) => {
      const rating = assessment.ratings.find((r) => r.useCaseId === uc.id);
      const level = rating?.level ?? 0;
      if (level <= 1) {
        rows.push(
          [
            escapeCsv(area.title),
            escapeCsv(uc.id),
            escapeCsv(uc.title),
            escapeCsv(level),
            escapeCsv(2),
            escapeCsv(uc.microsoftLearnUrl),
          ].join(',')
        );
      }
    });
  });

  const csv = rows.join('\n');
  downloadCsv(csv, `Entwicklungsplan_${profile.nachname}_${profile.vorname}.csv`);
}

export function exportTeamCsv(
  profiles: EmployeeProfile[],
  allAssessments: AssessmentData[]
): void {
  const areaHeaders = COMPETENCY_AREAS.map((a) => escapeCsv(a.title));
  const rows: string[] = [
    ['ID', 'Name', 'Abteilung', 'Rolle', ...areaHeaders, 'Gesamt Ø'].join(','),
  ];

  profiles.forEach((profile) => {
    const assessment = allAssessments.find((a) => a.employeeId === profile.id);
    const areaScores = assessment ? calcAreaScores(assessment.ratings) : [];
    const scores = COMPETENCY_AREAS.map((area) => {
      const score = areaScores.find((s) => s.areaId === area.id);
      return escapeCsv(score ? score.average.toFixed(1) : '–');
    });
    const overall = areaScores.length > 0
      ? (areaScores.reduce((sum, s) => sum + s.average, 0) / areaScores.length).toFixed(1)
      : '–';

    rows.push(
      [
        escapeCsv(profile.id),
        escapeCsv(`${profile.nachname}, ${profile.vorname}`),
        escapeCsv(profile.abteilung),
        escapeCsv(profile.rolle),
        ...scores,
        escapeCsv(overall),
      ].join(',')
    );
  });

  const csv = rows.join('\n');
  downloadCsv(csv, 'Team_Kompetenzmatrix.csv');
}

function downloadCsv(csv: string, filename: string): void {
  const BOM = '﻿'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
