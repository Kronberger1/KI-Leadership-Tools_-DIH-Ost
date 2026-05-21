import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, LogIn, ChevronDown, Shield } from 'lucide-react';

interface Props {
  onLogin: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  isInitializing: boolean;
}

const DEMO_ACCOUNTS = [
  {
    username: 'lisa.hr',
    password: 'hr2024',
    role: 'HR / Admin',
    badge: '#dcfce7',
    badgeText: '#166534',
    desc: 'Vollzugriff auf alle Daten und Abteilungen',
  },
  {
    username: 'max.lead',
    password: 'lead2024',
    role: 'Teamleiter · IT',
    badge: '#dbeafe',
    badgeText: '#1d4ed8',
    desc: 'Team-Überblick für IT-Abteilung',
  },
  {
    username: 'anna.mit',
    password: 'mit2024',
    role: 'Mitarbeiterin',
    badge: '#f3f4f6',
    badgeText: '#374151',
    desc: 'Persönliches Dashboard & anonymer Rollenvergleich',
  },
];

export const LoginScreen: React.FC<Props> = ({ onLogin, isInitializing }) => {
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [showDemo, setShowDemo]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Bitte Benutzername und Passwort eingeben.');
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await onLogin(username.trim(), password);
    setIsLoading(false);
    if (!result.success) setError(result.error ?? 'Anmeldung fehlgeschlagen.');
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError('');
  };

  const busy = isInitializing || isLoading;

  const inputCls =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 ' +
    'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f2136 0%, #1e3a5f 50%, #2a4f7c 100%)' }}
    >
      <div className="w-full max-w-sm view-transition">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
          >
            <Sparkles size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">KI Kompetenzmatrix</h1>
          <p className="text-sm text-white/60">ABA – Microsoft Copilot Bewertungssystem</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Card header stripe */}
          <div
            className="px-6 py-4 flex items-center gap-2 border-b border-gray-100"
            style={{ backgroundColor: '#f8fafc' }}
          >
            <Shield size={16} style={{ color: '#0d9488' }} />
            <span className="text-sm font-semibold text-gray-700">Anmelden</span>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Benutzername
                </label>
                <input
                  className={inputCls}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="benutzername"
                  autoComplete="username"
                  disabled={busy}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    className={inputCls + ' pr-10'}
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={busy}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2.5 border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                style={{ backgroundColor: '#0d9488' }}
              >
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {isInitializing ? 'Initialisierung…' : 'Anmelden…'}
                  </>
                ) : (
                  <><LogIn size={16} /> Anmelden</>
                )}
              </button>
            </form>

            {/* Demo credentials accordion */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDemo(s => !s)}
                className="w-full flex items-center justify-between text-xs font-medium text-gray-400 hover:text-gray-600 transition"
              >
                <span>Demo-Zugangsdaten anzeigen</span>
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200"
                  style={{ transform: showDemo ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {showDemo && (
                <div className="mt-3 space-y-2">
                  {DEMO_ACCOUNTS.map(acc => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => fillDemo(acc)}
                      className="w-full text-left px-3 py-2.5 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-gray-700 font-mono group-hover:text-teal-700">
                          {acc.username}
                        </span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: acc.badge, color: acc.badgeText }}
                        >
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">{acc.desc}</p>
                    </button>
                  ))}
                  <p className="text-[10px] text-gray-300 text-center pt-1">
                    Klicken zum Ausfüllen
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          Sitzung läuft nach 8 Stunden Inaktivität ab
        </p>
      </div>
    </div>
  );
};
