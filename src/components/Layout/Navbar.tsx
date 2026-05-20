import React from 'react';
import { LayoutDashboard, ClipboardList, TrendingUp, Users, UserCircle, Sparkles } from 'lucide-react';
import type { View } from '../../types';

interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  teamOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assessment', label: 'Selbsteinschätzung', icon: ClipboardList },
  { id: 'gap', label: 'Entwicklungsplan', icon: TrendingUp },
  { id: 'team', label: 'Team-Überblick', icon: Users },
];

interface Props {
  currentView: View;
  onNavigate: (view: View) => void;
  profileName: string;
  onEditProfile: () => void;
  isTeamMode: boolean;
  onToggleTeamMode: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  profileName,
  onEditProfile,
  isTeamMode,
  onToggleTeamMode,
}) => {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 shadow-lg"
      style={{ background: 'linear-gradient(90deg, #1e3a5f 0%, #2a4f7c 100%)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm hidden md:block">
            KI Kompetenzmatrix
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Team mode toggle */}
          <button
            onClick={onToggleTeamMode}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isTeamMode
                ? 'bg-teal-400/30 text-teal-200'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/15'
            }`}
          >
            <Users size={13} />
            {isTeamMode ? 'Team-Ansicht' : 'Meine Ansicht'}
          </button>

          {/* Profile button */}
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-xs font-medium"
          >
            <UserCircle size={15} />
            <span className="hidden sm:block">{profileName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
