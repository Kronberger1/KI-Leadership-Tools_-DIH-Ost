import { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { ProfileSetup } from './components/Profile';
import { Dashboard } from './components/Dashboard';
import { Assessment } from './components/Assessment';
import { GapAnalysis } from './components/GapAnalysis';
import { TeamOverview } from './components/TeamOverview';
import { LoginScreen } from './components/Auth/LoginScreen';
import { useAssessmentStore } from './hooks/useAssessmentStore';
import { useAuth } from './hooks/useAuth';
import type { View } from './types';
import './index.css';

export default function App() {
  // ── Auth ────────────────────────────────────────────────────────────────
  const { currentUser, isAuthenticated, isInitialized, login, logout } = useAuth();

  // ── Store ────────────────────────────────────────────────────────────────
  const store = useAssessmentStore();

  // ── UI state ─────────────────────────────────────────────────────────────
  const [view, setView] = useState<View>('dashboard');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [assessmentAreaId, setAssessmentAreaId] = useState<string | undefined>(undefined);

  // ── Sync active employee when auth session changes ───────────────────────
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      store.setActiveEmployee(currentUser.employeeId);
    } else {
      store.clearActiveEmployee();
    }
    // Reset view to dashboard on session change
    setView('dashboard');
    setShowProfileEditor(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentUser?.employeeId]);

  // ── Navigation callbacks (must be before any conditional return) ─────────
  const navigateToAssessment = useCallback((areaId?: string) => {
    setAssessmentAreaId(areaId);
    setView('assessment');
  }, []);

  const handleNavigate = useCallback((v: View) => {
    setView(v);
    if (v !== 'assessment') setAssessmentAreaId(undefined);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    store.clearActiveEmployee();
    setView('dashboard');
    setShowProfileEditor(false);
  }, [logout, store]);

  // ── Show login screen when not authenticated ─────────────────────────────
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={login}
        isInitializing={!isInitialized}
      />
    );
  }

  // ── Show profile setup when no profile or explicit edit ──────────────────
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

  const userRole = currentUser!.role;
  const userDepartment = currentUser!.department;

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
            userRole={userRole}
            allProfiles={store.teamProfiles}
            allAssessments={store.allAssessments}
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
            userRole={userRole}
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
        // Guard: Mitarbeiter should not reach this view (nav hides the tab, but be safe)
        if (userRole === 'Mitarbeiter') {
          return (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-600">
                  Keine Berechtigung für diese Ansicht.
                </p>
              </div>
            </div>
          );
        }
        return (
          <TeamOverview
            teamProfiles={store.teamProfiles}
            allAssessments={store.allAssessments}
            userRole={userRole}
            userDepartment={userDepartment}
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
        onNavigate={handleNavigate}
        profileName={`${store.currentProfile.vorname} ${store.currentProfile.nachname}`}
        onEditProfile={() => setShowProfileEditor(true)}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderView()}
      </main>
    </div>
  );
}
