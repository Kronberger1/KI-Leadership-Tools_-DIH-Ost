import React, { useState } from 'react';
import { User, ChevronRight, Sparkles } from 'lucide-react';
import { DEPARTMENTS, BEWERTUNGSZEITRAEUME } from '../../data/competencies';
import type { EmployeeProfile } from '../../types';

interface Props {
  existingProfile: EmployeeProfile | null;
  onSave: (profile: EmployeeProfile) => void;
}

function generateId(): string {
  return 'emp-' + Math.floor(Math.random() * 9000 + 1000);
}

export const ProfileSetup: React.FC<Props> = ({ existingProfile, onSave }) => {
  const [vorname, setVorname] = useState(existingProfile?.vorname ?? '');
  const [nachname, setNachname] = useState(existingProfile?.nachname ?? '');
  const [abteilung, setAbteilung] = useState(existingProfile?.abteilung ?? '');
  const [rolle, setRolle] = useState(existingProfile?.rolle ?? '');
  const [zeitraum, setZeitraum] = useState(existingProfile?.bewertungszeitraum ?? BEWERTUNGSZEITRAEUME[4]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = abteilung ? DEPARTMENTS[abteilung] ?? [] : [];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!vorname.trim()) e.vorname = 'Bitte Vornamen eingeben';
    if (!nachname.trim()) e.nachname = 'Bitte Nachnamen eingeben';
    if (!abteilung) e.abteilung = 'Bitte Abteilung auswählen';
    if (!rolle) e.rolle = 'Bitte Rolle auswählen';
    if (!zeitraum) e.zeitraum = 'Bitte Zeitraum auswählen';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      id: existingProfile?.id ?? generateId(),
      vorname: vorname.trim(),
      nachname: nachname.trim(),
      abteilung,
      rolle,
      bewertungszeitraum: zeitraum,
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="w-full max-w-lg view-transition">
        {/* Header card */}
        <div
          className="rounded-2xl p-8 mb-6 text-white shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2a4f7c 100%)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <Sparkles size={22} />
            </div>
            <span className="text-sm font-medium opacity-80">ABA – Microsoft Copilot</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">KI-Fluency Kompetenzmatrix</h1>
          <p className="text-sm opacity-75 leading-relaxed">
            Bewerte deine Microsoft Copilot-Kompetenzen strukturiert nach 36 Use Cases in 9 Bereichen –
            und erhalte einen personalisierten Entwicklungsplan.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#e6f4f3' }}
            >
              <User size={18} style={{ color: '#0d9488' }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {existingProfile ? 'Profil bearbeiten' : 'Dein Profil einrichten'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Vorname</label>
                <input
                  className={inputClass}
                  value={vorname}
                  onChange={(e) => setVorname(e.target.value)}
                  placeholder="z.B. Anna"
                />
                {errors.vorname && <p className={errorClass}>{errors.vorname}</p>}
              </div>
              <div>
                <label className={labelClass}>Nachname</label>
                <input
                  className={inputClass}
                  value={nachname}
                  onChange={(e) => setNachname(e.target.value)}
                  placeholder="z.B. Müller"
                />
                {errors.nachname && <p className={errorClass}>{errors.nachname}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Abteilung</label>
              <select
                className={inputClass}
                value={abteilung}
                onChange={(e) => { setAbteilung(e.target.value); setRolle(''); }}
              >
                <option value="">– Bitte auswählen –</option>
                {Object.keys(DEPARTMENTS).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.abteilung && <p className={errorClass}>{errors.abteilung}</p>}
            </div>

            <div>
              <label className={labelClass}>Rolle</label>
              <select
                className={inputClass}
                value={rolle}
                onChange={(e) => setRolle(e.target.value)}
                disabled={!abteilung}
              >
                <option value="">– Bitte auswählen –</option>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.rolle && <p className={errorClass}>{errors.rolle}</p>}
            </div>

            <div>
              <label className={labelClass}>Bewertungszeitraum</label>
              <select
                className={inputClass}
                value={zeitraum}
                onChange={(e) => setZeitraum(e.target.value)}
              >
                {BEWERTUNGSZEITRAEUME.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              {errors.zeitraum && <p className={errorClass}>{errors.zeitraum}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md mt-2"
              style={{ backgroundColor: '#0d9488' }}
            >
              {existingProfile ? 'Änderungen speichern' : 'Los geht\'s'}
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
