import { useState, useCallback, useEffect } from 'react';
import { COMPETENCY_AREAS } from '../data/competencies';
import { SEED_PROFILES, SEED_ASSESSMENTS } from '../data/seedData';
import type {
  EmployeeProfile,
  AssessmentData,
  UseCaseRating,
  AreaScore,
  MaturityBadge,
  Level,
} from '../types';

const KEYS = {
  CURRENT_PROFILE: 'km_current_profile',
  ASSESSMENTS: 'km_assessments',
  TEAM_PROFILES: 'km_team_profiles',
  SEEDED: 'km_seeded',
};

// -----------------------------------------------------------------------
// Maturity badge lookup
// -----------------------------------------------------------------------
export function getMaturityBadge(avg: number): MaturityBadge {
  if (avg >= 4.0) return { label: 'Experte', emoji: '🏆', color: 'text-emerald-700', bgColor: 'bg-emerald-100', range: '4.0' };
  if (avg >= 3.0) return { label: 'Kompetent', emoji: '🟢', color: 'text-green-700', bgColor: 'bg-green-100', range: '3.0–3.9' };
  if (avg >= 2.0) return { label: 'Fortgeschritten', emoji: '🟡', color: 'text-yellow-700', bgColor: 'bg-yellow-100', range: '2.0–2.9' };
  if (avg >= 1.0) return { label: 'Grundkenntnisse', emoji: '🟠', color: 'text-orange-700', bgColor: 'bg-orange-100', range: '1.0–1.9' };
  return { label: 'Einsteiger', emoji: '🔴', color: 'text-red-700', bgColor: 'bg-red-100', range: '0.0–0.9' };
}

// -----------------------------------------------------------------------
// Derived calculations
// -----------------------------------------------------------------------
export function calcAreaScores(ratings: UseCaseRating[]): AreaScore[] {
  return COMPETENCY_AREAS.map((area) => {
    const ucIds = area.useCases.map((uc) => uc.id);
    const areaRatings = ratings.filter((r) => ucIds.includes(r.useCaseId));
    const levels = areaRatings.map((r) => r.level);
    const average = levels.length > 0 ? levels.reduce((a: number, b: number) => a + b, 0) / levels.length : 0;
    const pctLevel2Plus = levels.length > 0 ? (levels.filter((l) => l >= 2).length / levels.length) * 100 : 0;
    return {
      areaId: area.id,
      areaTitle: area.title,
      average,
      ratingsCount: areaRatings.length,
      totalUseCases: ucIds.length,
      pctLevel2Plus,
    };
  });
}

export function calcOverallAverage(ratings: UseCaseRating[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r.level, 0) / ratings.length;
}

// -----------------------------------------------------------------------
// Seed data initialiser
// -----------------------------------------------------------------------
function seedIfNeeded() {
  const already = localStorage.getItem(KEYS.SEEDED);
  if (already) return;

  const existingAssessments: AssessmentData[] = JSON.parse(
    localStorage.getItem(KEYS.ASSESSMENTS) || '[]'
  );
  const existingProfiles: EmployeeProfile[] = JSON.parse(
    localStorage.getItem(KEYS.TEAM_PROFILES) || '[]'
  );

  const mergedAssessments = [
    ...existingAssessments,
    ...SEED_ASSESSMENTS.filter(
      (sa) => !existingAssessments.find((ea) => ea.employeeId === sa.employeeId)
    ),
  ];
  const mergedProfiles = [
    ...existingProfiles,
    ...SEED_PROFILES.filter(
      (sp) => !existingProfiles.find((ep) => ep.id === sp.id)
    ),
  ];

  localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(mergedAssessments));
  localStorage.setItem(KEYS.TEAM_PROFILES, JSON.stringify(mergedProfiles));
  localStorage.setItem(KEYS.SEEDED, 'true');
}

// -----------------------------------------------------------------------
// Main hook
// -----------------------------------------------------------------------
export function useAssessmentStore() {
  const [currentProfile, setCurrentProfile] = useState<EmployeeProfile | null>(() => {
    seedIfNeeded();
    const raw = localStorage.getItem(KEYS.CURRENT_PROFILE);
    return raw ? JSON.parse(raw) : null;
  });

  const [allAssessments, setAllAssessments] = useState<AssessmentData[]>(() => {
    const raw = localStorage.getItem(KEYS.ASSESSMENTS);
    return raw ? JSON.parse(raw) : [];
  });

  const [teamProfiles, setTeamProfiles] = useState<EmployeeProfile[]>(() => {
    const raw = localStorage.getItem(KEYS.TEAM_PROFILES);
    return raw ? JSON.parse(raw) : [];
  });

  // Re-sync from localStorage on mount
  useEffect(() => {
    seedIfNeeded();
    const raw = localStorage.getItem(KEYS.ASSESSMENTS);
    if (raw) setAllAssessments(JSON.parse(raw));
    const rawProfiles = localStorage.getItem(KEYS.TEAM_PROFILES);
    if (rawProfiles) setTeamProfiles(JSON.parse(rawProfiles));
  }, []);

  // ---- Profile ----
  const saveProfile = useCallback((profile: EmployeeProfile) => {
    localStorage.setItem(KEYS.CURRENT_PROFILE, JSON.stringify(profile));
    setCurrentProfile(profile);

    // Also register in team profiles list
    const raw = localStorage.getItem(KEYS.TEAM_PROFILES);
    const profiles: EmployeeProfile[] = raw ? JSON.parse(raw) : [];
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) profiles[idx] = profile;
    else profiles.push(profile);
    localStorage.setItem(KEYS.TEAM_PROFILES, JSON.stringify(profiles));
    setTeamProfiles(profiles);
  }, []);

  // ---- Assessment for current user ----
  const currentAssessment = currentProfile
    ? allAssessments.find((a) => a.employeeId === currentProfile.id) ?? {
        employeeId: currentProfile.id,
        ratings: [],
        lastUpdated: new Date().toISOString(),
      }
    : null;

  const saveRating = useCallback(
    (useCaseId: number, level: Level, evidence?: string, comment?: string) => {
      if (!currentProfile) return;

      setAllAssessments((prev) => {
        const existing = prev.find((a) => a.employeeId === currentProfile.id);
        let updatedRatings: UseCaseRating[];

        if (existing) {
          const rIdx = existing.ratings.findIndex((r) => r.useCaseId === useCaseId);
          if (rIdx >= 0) {
            updatedRatings = existing.ratings.map((r, i) =>
              i === rIdx ? { ...r, level, evidence, comment } : r
            );
          } else {
            updatedRatings = [...existing.ratings, { useCaseId, level, evidence, comment }];
          }
        } else {
          updatedRatings = [{ useCaseId, level, evidence, comment }];
        }

        const updated: AssessmentData = {
          employeeId: currentProfile.id,
          ratings: updatedRatings,
          lastUpdated: new Date().toISOString(),
        };

        const newAll = existing
          ? prev.map((a) => (a.employeeId === currentProfile.id ? updated : a))
          : [...prev, updated];

        localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(newAll));
        return newAll;
      });
    },
    [currentProfile]
  );

  const getRating = useCallback(
    (useCaseId: number): UseCaseRating | undefined => {
      return currentAssessment?.ratings.find((r) => r.useCaseId === useCaseId);
    },
    [currentAssessment]
  );

  // ---- Derived data ----
  const areaScores = currentAssessment ? calcAreaScores(currentAssessment.ratings) : [];
  const overallAverage = currentAssessment ? calcOverallAverage(currentAssessment.ratings) : 0;
  const maturityBadge = getMaturityBadge(overallAverage);

  const totalRated = currentAssessment?.ratings.length ?? 0;
  const pctLevel2Plus =
    totalRated > 0
      ? Math.round(
          (currentAssessment!.ratings.filter((r) => r.level >= 2).length / totalRated) * 100
        )
      : 0;
  const pctLevel3Plus =
    totalRated > 0
      ? Math.round(
          (currentAssessment!.ratings.filter((r) => r.level >= 3).length / totalRated) * 100
        )
      : 0;

  const strengths = [...areaScores].sort((a, b) => b.average - a.average).slice(0, 3);
  const gaps = [...areaScores].sort((a, b) => a.average - b.average).slice(0, 3);

  const gapUseCases = currentAssessment
    ? COMPETENCY_AREAS.flatMap((area) =>
        area.useCases
          .map((uc) => {
            const r = currentAssessment.ratings.find((r) => r.useCaseId === uc.id);
            return { area, uc, level: r?.level ?? 0 };
          })
          .filter((item) => item.level <= 1)
      )
    : [];

  // ---- Team data ----
  const getAssessmentForEmployee = useCallback(
    (employeeId: string): AssessmentData | undefined => {
      return allAssessments.find((a) => a.employeeId === employeeId);
    },
    [allAssessments]
  );

  return {
    currentProfile,
    saveProfile,
    currentAssessment,
    saveRating,
    getRating,
    areaScores,
    overallAverage,
    maturityBadge,
    totalRated,
    pctLevel2Plus,
    pctLevel3Plus,
    strengths,
    gaps,
    gapUseCases,
    teamProfiles,
    allAssessments,
    getAssessmentForEmployee,
  };
}
