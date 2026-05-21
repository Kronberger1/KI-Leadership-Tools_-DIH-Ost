import React from 'react';
import { LayoutDashboard, ClipboardList, TrendingUp, Users, UserCircle, Sparkles, LogOut } from 'lucide-react';
import type { View, UserRole } from '../../types';

interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  minRole?: UserRole; // only roles with equal or higher privilege see this
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { id: 'assessment',  label: 'Selbsteinschätzung', icon: ClipboardList },
  { id: 'gap',         label: 'Entwicklungsplan',   icon: TrendingUp },
  { id: 'team',        label: 'Team-Überblick',     icon: Users, minRole: 'Teamleiter' },
];

// Roles ordered by privilege (lowest → highest)
const ROLE_RANK: Record<UserRole, number> = {
  Mitarbeiter: 0,
  Teamleiter:  1,
  HR:          2,
};

const ROLE_BADGE: Record<UserRole, { bg: string; text: string; label: string }> = {
  Mitarbeiter: { bg: '#f3f4f6', text: '#374151', label: 'Mitarbeiter:in' },
  Teamleiter:  { bg: '#dbeafe', text: '#1d4ed8', label: 'Teamleiter:in' },
  HR:          { bg: '#dcfce7', text: '#166534', label: 'HR / Admin' },
};

interface Props {
  currentView: View;
  onNavigate: (view: View) => void;
  profileName: string;
  onEditProfile: () => void;
  userRole: UserRole;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  profileName,
  onEditProfile,
  userRole,
  onLogout,
}) => {
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.minRole || ROLE_RANK[userRole] >= ROLE_RANK[item.minRole]
  );

  const badge = ROLE_BADGE[userRole];

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
          {visibleItems.map((item) => {
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
          {/* Role badge */}
          <span
            className="hidden md:block text-[10px] font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label}
          </span>

          {/* Profile button */}
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-white text-xs font-medium"
          >
            <UserCircle size={15} />
            <span className="hidden sm:block">{profileName}</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition text-xs font-medium"
            title="Abmelden"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Abmelden</span>
          </button>
        </div>
      </div>
    </header>
  );
};
