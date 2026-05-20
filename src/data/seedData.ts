import type { EmployeeProfile, AssessmentData, UseCaseRating } from '../types';
import type { Level } from '../types';

// -----------------------------------------------------------------------
// Seed profiles
// -----------------------------------------------------------------------
export const SEED_PROFILES: EmployeeProfile[] = [
  { id: 'emp-39', vorname: 'Thomas', nachname: 'Bauer', abteilung: 'IT', rolle: 'Entwicklung', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-40', vorname: 'Maria', nachname: 'Huber', abteilung: 'IT', rolle: 'Entwicklung', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-46', vorname: 'Sophie', nachname: 'Maier', abteilung: 'Marketing-Kommunikation', rolle: 'Grafik', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-12', vorname: 'Klaus', nachname: 'Fischer', abteilung: 'Geschäftsführung', rolle: 'Management', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-23', vorname: 'Anna', nachname: 'Wolf', abteilung: 'Vertriebssupport', rolle: 'CRM-Management', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-31', vorname: 'Peter', nachname: 'Schmid', abteilung: 'Geschäftskunden', rolle: 'Key Account', bewertungszeitraum: 'H2 2025' },
  { id: 'emp-55', vorname: 'Laura', nachname: 'Gruber', abteilung: 'Administration', rolle: 'HR', bewertungszeitraum: 'H1 2026' },
  { id: 'emp-67', vorname: 'Michael', nachname: 'Steiner', abteilung: 'Marketing-Kommunikation', rolle: 'Online Communications', bewertungszeitraum: 'H2 2025' },
];

// -----------------------------------------------------------------------
// Helper: build ratings array from a map of useCase ID → level
// -----------------------------------------------------------------------
function buildRatings(map: Record<number, Level>): UseCaseRating[] {
  return Object.entries(map).map(([id, level]) => ({
    useCaseId: Number(id),
    level,
  }));
}

// -----------------------------------------------------------------------
// emp-39: IT / Entwicklung — high scorer. Strong everywhere, weak Dynamics & Excel
// -----------------------------------------------------------------------
const ratings39: Record<number, Level> = {
  1: 4, 2: 4, 3: 3, 4: 4,
  5: 4, 6: 4, 7: 3, 8: 4,
  9: 4, 10: 3, 11: 4, 12: 4,
  13: 2, 14: 3, 15: 2, 16: 3,
  17: 4, 18: 4, 19: 3, 20: 4,
  21: 2, 22: 1, 23: 2, 24: 2,
  25: 4, 26: 3, 27: 4, 28: 4,
  29: 4, 30: 3, 31: 4, 32: 3,
  33: 4, 34: 4, 35: 3, 36: 4,
};

// -----------------------------------------------------------------------
// emp-40: IT / Entwicklung — mid scorer, some 0s
// -----------------------------------------------------------------------
const ratings40: Record<number, Level> = {
  1: 3, 2: 3, 3: 2, 4: 2,
  5: 3, 6: 2, 7: 3, 8: 2,
  9: 3, 10: 2, 11: 2, 12: 3,
  13: 2, 14: 3, 15: 2, 16: 2,
  17: 3, 18: 2, 19: 2, 20: 3,
  21: 1, 22: 0, 23: 1, 24: 2,
  25: 3, 26: 2, 27: 2, 28: 3,
  29: 2, 30: 2, 31: 1, 32: 0,
  33: 2, 34: 2, 35: 1, 36: 1,
};

// -----------------------------------------------------------------------
// emp-46: Marketing / Grafik — lower scorer, clear gaps in Agents & Prompts
// -----------------------------------------------------------------------
const ratings46: Record<number, Level> = {
  1: 2, 2: 1, 3: 2, 4: 1,
  5: 2, 6: 2, 7: 1, 8: 1,
  9: 3, 10: 3, 11: 2, 12: 2,
  13: 1, 14: 1, 15: 2, 16: 1,
  17: 2, 18: 2, 19: 1, 20: 2,
  21: 0, 22: 0, 23: 0, 24: 1,
  25: 2, 26: 1, 27: 2, 28: 2,
  29: 1, 30: 0, 31: 0, 32: 0,
  33: 2, 34: 1, 35: 1, 36: 0,
};

// -----------------------------------------------------------------------
// emp-12: Geschäftsführung / Management — competent, focused on Outlook & Teams
// -----------------------------------------------------------------------
const ratings12: Record<number, Level> = {
  1: 3, 2: 3, 3: 4, 4: 3,
  5: 4, 6: 4, 7: 4, 8: 3,
  9: 3, 10: 3, 11: 2, 12: 3,
  13: 2, 14: 1, 15: 2, 16: 2,
  17: 4, 18: 4, 19: 4, 20: 4,
  21: 3, 22: 2, 23: 3, 24: 3,
  25: 3, 26: 3, 27: 4, 28: 3,
  29: 2, 30: 3, 31: 2, 32: 2,
  33: 3, 34: 3, 35: 3, 36: 2,
};

// -----------------------------------------------------------------------
// emp-23: Vertriebssupport / CRM — strong in Dynamics & Outlook
// -----------------------------------------------------------------------
const ratings23: Record<number, Level> = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3, 7: 2, 8: 2,
  9: 2, 10: 2, 11: 2, 12: 2,
  13: 2, 14: 2, 15: 3, 16: 2,
  17: 4, 18: 3, 19: 4, 20: 3,
  21: 4, 22: 4, 23: 3, 24: 4,
  25: 2, 26: 2, 27: 2, 28: 3,
  29: 1, 30: 2, 31: 1, 32: 1,
  33: 2, 34: 2, 35: 2, 36: 1,
};

// -----------------------------------------------------------------------
// emp-31: Geschäftskunden / Key Account — mid range
// -----------------------------------------------------------------------
const ratings31: Record<number, Level> = {
  1: 2, 2: 2, 3: 2, 4: 3,
  5: 3, 6: 3, 7: 2, 8: 2,
  9: 2, 10: 3, 11: 2, 12: 2,
  13: 1, 14: 1, 15: 1, 16: 2,
  17: 3, 18: 3, 19: 3, 20: 3,
  21: 3, 22: 2, 23: 3, 24: 3,
  25: 2, 26: 2, 27: 3, 28: 2,
  29: 1, 30: 1, 31: 1, 32: 1,
  33: 2, 34: 2, 35: 2, 36: 1,
};

// -----------------------------------------------------------------------
// emp-55: Administration / HR — some gaps in technical areas
// -----------------------------------------------------------------------
const ratings55: Record<number, Level> = {
  1: 3, 2: 2, 3: 3, 4: 2,
  5: 3, 6: 3, 7: 3, 8: 2,
  9: 3, 10: 3, 11: 2, 12: 3,
  13: 1, 14: 0, 15: 2, 16: 1,
  17: 3, 18: 3, 19: 3, 20: 3,
  21: 1, 22: 1, 23: 1, 24: 2,
  25: 3, 26: 2, 27: 3, 28: 2,
  29: 1, 30: 1, 31: 1, 32: 1,
  33: 2, 34: 2, 35: 2, 36: 1,
};

// -----------------------------------------------------------------------
// emp-67: Marketing / Online Comms — strong research, weak Excel/Dynamics
// -----------------------------------------------------------------------
const ratings67: Record<number, Level> = {
  1: 3, 2: 2, 3: 2, 4: 3,
  5: 3, 6: 2, 7: 3, 8: 2,
  9: 4, 10: 4, 11: 3, 12: 3,
  13: 1, 14: 1, 15: 1, 16: 1,
  17: 3, 18: 3, 19: 2, 20: 3,
  21: 0, 22: 0, 23: 0, 24: 1,
  25: 4, 26: 3, 27: 4, 28: 3,
  29: 2, 30: 2, 31: 2, 32: 1,
  33: 3, 34: 3, 35: 3, 36: 2,
};

// -----------------------------------------------------------------------
// Exported seed assessments
// -----------------------------------------------------------------------
export const SEED_ASSESSMENTS: AssessmentData[] = [
  { employeeId: 'emp-39', ratings: buildRatings(ratings39), lastUpdated: '2026-05-15T10:00:00Z' },
  { employeeId: 'emp-40', ratings: buildRatings(ratings40), lastUpdated: '2026-05-14T14:00:00Z' },
  { employeeId: 'emp-46', ratings: buildRatings(ratings46), lastUpdated: '2026-05-12T09:00:00Z' },
  { employeeId: 'emp-12', ratings: buildRatings(ratings12), lastUpdated: '2026-05-16T11:00:00Z' },
  { employeeId: 'emp-23', ratings: buildRatings(ratings23), lastUpdated: '2026-05-13T16:00:00Z' },
  { employeeId: 'emp-31', ratings: buildRatings(ratings31), lastUpdated: '2026-04-28T10:00:00Z' },
  { employeeId: 'emp-55', ratings: buildRatings(ratings55), lastUpdated: '2026-05-10T09:30:00Z' },
  { employeeId: 'emp-67', ratings: buildRatings(ratings67), lastUpdated: '2026-04-30T15:00:00Z' },
];
