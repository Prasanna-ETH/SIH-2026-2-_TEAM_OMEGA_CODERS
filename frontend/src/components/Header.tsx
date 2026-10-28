import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ShieldCheck, Building2, UserCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, unreadNotificationsCount }) => {
  const { user, switchRole, logout } = useAuth();
  const { language, t } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200">
      {/* Indian National Tricolor Thin Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white border-y border-slate-200"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Institutional Header Strip */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: AICTE Institutional Identity & Emblem Motif */}
        <div className="flex items-center space-x-3.5">
          {/* Official Geometric AICTE Emblem Emblem SVG */}
          <div className="w-14 h-14 rounded-full bg-[#0b2545] border-2 border-amber-500/80 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-white fill-current">
              {/* Ashoka Chakra & AICTE Emblem Stylized Regulatory Geometry */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="#FF9933" strokeWidth="3" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="50" cy="50" r="10" fill="#FF9933" />
              {/* 24 radiating spokes */}
              {[...Array(24)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 34 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 34 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
              <circle cx="50" cy="50" r="4" fill="#0b2545" />
            </svg>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
              {language === 'hi' ? 'अखिल भारतीय तकनीकी शिक्षा परिषद' : 'All India Council for Technical Education'}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0b2545] tracking-tight leading-tight">
              {language === 'hi'
                ? 'अपार छात्र डेटा एवं सत्यापन प्रणाली (ASDVS)'
                : 'APAAR Student Data & Verification System'}
            </h1>
            <div className="text-xs text-slate-600 font-medium flex items-center gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>{language === 'hi' ? 'केंद्रीय विनियामक निगरानी पोर्टल' : 'Central Regulatory Governance Portal'}</span>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-slate-700">Academic Year 2026–27</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Prototype Demo Role Switcher & User Profile */}
        <div className="flex flex-col items-end gap-1.5 w-full md:w-auto">
          {/* Quick Demo Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-300 text-xs">
            <span className="text-slate-500 font-semibold px-2">Demo Role:</span>
            <button
              onClick={() => switchRole('AICTE_ADMIN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'AICTE_ADMIN'
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AICTE Official</span>
            </button>

            <button
              onClick={() => switchRole('INSTITUTION')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'INSTITUTION'
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>ABC Tech (Inst)</span>
            </button>

            <button
              onClick={() => switchRole('VERIFIER')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'VERIFIER'
                  ? 'bg-[#0b2545] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verifier (TCS)</span>
            </button>
          </div>

          {/* User Profile Info & Action Bar */}
          <div className="flex items-center space-x-3 text-xs text-slate-600">
            {user && (
              <div className="text-right">
                <span className="font-semibold text-slate-800">{user.full_name}</span>
                <span className="text-slate-500 ml-1.5">
                  ({user.role === 'AICTE_ADMIN' ? 'AICTE Central HQ' : user.institution_name || user.role})
                </span>
              </div>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Official Prototype Disclaimer Strip */}
      <div className="bg-amber-50 border-t border-b border-amber-200 px-4 py-1.5 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded text-[11px]">DEMO</span>
            <span>
              <strong>Smart India Hackathon (SIH26263 Prototype):</strong> Official regulatory demonstration environment. All institutional, student and APAAR records are synthetic test cases.
            </span>
          </div>
          <span className="font-semibold text-amber-800 hidden md:inline">
            Status: Central Validation Active
          </span>
        </div>
      </div>
    </header>
  );
};
