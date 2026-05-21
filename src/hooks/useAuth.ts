import { useState, useEffect, useCallback } from 'react';
import type { UserAccount, AuthSession } from '../types';

const AUTH_KEYS = {
  USERS:       'km_auth_users',
  SESSION:     'km_auth_session',
  AUTH_SEEDED: 'km_auth_seeded',
};

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const ACTIVITY_THROTTLE_MS = 60_000;             // update at most once per minute

// ── SHA-256 via Web Crypto API (no plain-text passwords stored) ──────────
export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Seed demo accounts once ───────────────────────────────────────────────
async function seedAuthAccounts(): Promise<void> {
  if (localStorage.getItem(AUTH_KEYS.AUTH_SEEDED)) return;

  const [hrHash, leadHash, mitHash] = await Promise.all([
    sha256('hr2024'),
    sha256('lead2024'),
    sha256('mit2024'),
  ]);

  const accounts: UserAccount[] = [
    {
      id: 'user-hr-01',
      username: 'lisa.hr',
      passwordHash: hrHash,
      role: 'HR',
      employeeId: 'emp-hr-01',
      // HR sees all departments — no department restriction
    },
    {
      id: 'user-lead-01',
      username: 'max.lead',
      passwordHash: leadHash,
      role: 'Teamleiter',
      employeeId: 'emp-39',   // Thomas Bauer, IT
      department: 'IT',
    },
    {
      id: 'user-mit-01',
      username: 'anna.mit',
      passwordHash: mitHash,
      role: 'Mitarbeiter',
      employeeId: 'emp-46',   // Sophie Maier, Marketing-Kommunikation
      department: 'Marketing-Kommunikation',
    },
  ];

  localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(accounts));
  localStorage.setItem(AUTH_KEYS.AUTH_SEEDED, 'true');
}

// ── Read & validate session from localStorage ─────────────────────────────
function readSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.SESSION);
    if (!raw) return null;
    const s: AuthSession = JSON.parse(raw);
    if (Date.now() - s.lastActivity > SESSION_DURATION_MS) {
      localStorage.removeItem(AUTH_KEYS.SESSION);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(readSession);
  const [isInitialized, setIsInitialized] = useState(false);

  // Seed demo accounts asynchronously on mount
  useEffect(() => {
    seedAuthAccounts().then(() => setIsInitialized(true));
  }, []);

  // Keep lastActivity fresh while the user is interacting
  useEffect(() => {
    if (!session) return;

    let lastUpdate = Date.now();

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastUpdate < ACTIVITY_THROTTLE_MS) return;
      lastUpdate = now;

      setSession(prev => {
        if (!prev) return prev;
        const updated: AuthSession = { ...prev, lastActivity: now };
        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(updated));
        return updated;
      });
    };

    const events = ['click', 'keydown', 'touchstart', 'scroll'] as const;
    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, handleActivity));
  }, [session?.userId]);

  // ── login ────────────────────────────────────────────────────────────
  const login = useCallback(
    async (
      username: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const raw = localStorage.getItem(AUTH_KEYS.USERS);
        if (!raw) return { success: false, error: 'Keine Benutzerkonten gefunden.' };

        const users: UserAccount[] = JSON.parse(raw);
        const hash = await sha256(password);
        const user = users.find(
          u => u.username === username.trim() && u.passwordHash === hash
        );

        if (!user) {
          return { success: false, error: 'Ungültiger Benutzername oder Passwort.' };
        }

        const newSession: AuthSession = {
          userId: user.id,
          employeeId: user.employeeId,
          role: user.role,
          username: user.username,
          department: user.department,
          loggedInAt: Date.now(),
          lastActivity: Date.now(),
        };

        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(newSession));
        setSession(newSession);
        return { success: true };
      } catch {
        return { success: false, error: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.' };
      }
    },
    []
  );

  // ── logout ───────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    setSession(null);
  }, []);

  return {
    currentUser: session,
    role: session?.role ?? null,
    isAuthenticated: !!session,
    isInitialized,
    login,
    logout,
  };
}
