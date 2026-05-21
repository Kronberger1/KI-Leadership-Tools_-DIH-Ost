export type Level = 0 | 1 | 2 | 3 | 4;
export type View = 'profile' | 'dashboard' | 'assessment' | 'gap' | 'team';
export type UserRole = 'Mitarbeiter' | 'Teamleiter' | 'HR';

export interface UseCaseRating {
  useCaseId: number;
  level: Level;
  evidence?: string;
  comment?: string;
}

export interface EmployeeProfile {
  id: string;
  vorname: string;
  nachname: string;
  abteilung: string;
  rolle: string;
  bewertungszeitraum: string;
}

export interface AssessmentData {
  employeeId: string;
  ratings: UseCaseRating[];
  lastUpdated: string;
}

export interface EmployeeWithAssessment {
  profile: EmployeeProfile;
  assessment: AssessmentData;
}

export interface AreaScore {
  areaId: string;
  areaTitle: string;
  average: number;
  ratingsCount: number;
  totalUseCases: number;
  pctLevel2Plus: number;
}

export interface MaturityBadge {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  range: string;
}

// ── Auth types ──────────────────────────────────────────────────────────────

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  employeeId: string;
  department?: string; // required for Teamleiter
}

export interface AuthSession {
  userId: string;
  employeeId: string;
  role: UserRole;
  username: string;
  department?: string;
  loggedInAt: number;
  lastActivity: number;
}
