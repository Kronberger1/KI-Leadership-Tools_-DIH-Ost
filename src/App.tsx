import { useState, useCallback } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { ProfileSetup } from './components/Profile';
import { Dashboard } from './components/Dashboard';
import { Assessment } from './components/Assessment';
import { GapAnalysis } from './components/GapAnalysis';
import { TeamOverview } from './components/TeamOverview';
import { useAssessmentStore } from './hooks/useAssessmentStore';
import type { View } from './types';
import './index.css';

export default function App() {
  const store = useAssessmentStore();
  const [view, setView] = useState<View>('dashboard');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [assessmentAreaId, setAssessmentAreaId] = useState<string | undefined>(undefined);
  const [isTeamMode, setIsTeamMode] = useState(false);

  // Show profile setup on first visit
  if (!store.currentProfile || showProfileEditor) {
    return (
      <ProfileSetup
        existingProfile={store.currentProfile}
        onSave={(profile) => {
          store.saveProfile(profile);
          setShowProfileEditor(false);
          setView('dashboard');
        }}
      />
    );
  }

  const navigateToAssessment = useCallback((areaId?: string) => {
    setAssessmentAreaId(areaId);
    setView('assessment');
  }, []);

  const handleTeamToggle = () => {
    const next = !isTeamMode;
    setIsTeamMode(next);
    if (next) setView('team');
    else setView('dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            profile={store.currentProfile!}
            areaScores={store.areaScores}
            overallAverage={store.overallAverage}
            maturityBadge={store.maturityBadge}
            totalRated={store.totalRated}
            pctLevel2Plus={store.pctLevel2Plus}
            pctLevel3Plus={store.pctLevel3Plus}
            strengths={store.strengths}
            gaps={store.gaps}
            onNavigateToAssessment={navigateToAssessment}
          />
        );

      case 'assessment':
        return (
          <Assessment
            key={assessmentAreaId ?? 'all'}
            initialAreaId={assessmentAreaId}
            getRating={store.getRating}
            saveRating={store.saveRating}
          />
        );

      case 'gap':
        return store.currentAssessment ? (
          <GapAnalysis
            profile={store.currentProfile!}
            assessment={store.currentAssessment}
            gapUseCases={store.gapUseCases}
            onNavigateToAssessment={navigateToAssessment}
          />
        ) : (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-600">
                Noch keine Bewertungsdaten vorhanden.
              </p>
              <button
                className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
                style={{ backgroundColor: '#0d9488' }}
                onClick={() => setView('assessment')}
              >
                Zur Selbsteinschätzung
              </button>
            </div>
          </div>
        );

      case 'team':
        return (
          <TeamOverview
            teamProfiles={store.teamProfiles}
            allAssessments={store.allAssessments}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f4f8' }}>
      <Navbar
        currentView={view}
        onNavigate={(v) => {
          setView(v);
          if (v !== 'assessment') setAssessmentAreaId(undefined);
        }}
        profileName={`${store.currentProfile.vorname} ${store.currentProfile.nachname}`}
        onEditProfile={() => setShowProfileEditor(true)}
        isTeamMode={isTeamMode}
        onToggleTeamMode={handleTeamToggle}
      />
      <main className="flex-1">
        {renderView()}
      </main>
    </div>
  );
}
