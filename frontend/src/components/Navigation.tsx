import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Upload,
  AlertOctagon,
  Copy,
  BarChart3,
  CheckCircle2,
  PieChart,
  History
} from 'lucide-react';

interface NavigationProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentRoute, onRouteChange }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const isAicte = user?.role === 'AICTE_ADMIN';
  const isInst = user?.role === 'INSTITUTION';
  const isVerifier = user?.role === 'VERIFIER';

  const navItems = [
    {
      id: isAicte ? '/aicte/dashboard' : isInst ? '/institution/dashboard' : '/verification',
      label: t('nav_dashboard'),
      icon: LayoutDashboard,
      visible: true
    },
    {
      id: '/institutions',
      label: t('nav_institutions'),
      icon: Building2,
      visible: isAicte
    },
    {
      id: '/institution/upload',
      label: t('nav_upload'),
      icon: Upload,
      visible: isInst || isAicte
    },
    {
      id: '/students',
      label: t('nav_registry'),
      icon: Users,
      visible: !isVerifier
    },
    {
      id: '/validation',
      label: t('nav_validation'),
      icon: AlertOctagon,
      visible: !isVerifier
    },
    {
      id: '/duplicates',
      label: t('nav_duplicates'),
      icon: Copy,
      visible: isAicte || isInst
    },
    {
      id: '/intake-compliance',
      label: t('nav_intake'),
      icon: BarChart3,
      visible: isAicte || isInst
    },
    {
      id: '/verification',
      label: t('nav_verification'),
      icon: CheckCircle2,
      visible: true
    },
    {
      id: '/analytics',
      label: t('nav_analytics'),
      icon: PieChart,
      visible: isAicte || isInst
    },
    {
      id: '/audit',
      label: t('nav_audit'),
      icon: History,
      visible: !isVerifier
    }
  ];

  return (
    <nav className="bg-[#0b2545] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-none">
        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              currentRoute === item.id ||
              (item.id.includes('dashboard') && currentRoute.includes('dashboard')) ||
              (item.id === '/students' && currentRoute.startsWith('/students/')) ||
              (item.id === '/institutions' && currentRoute.startsWith('/institutions/'));

            return (
              <button
                key={item.id}
                onClick={() => onRouteChange(item.id)}
                className={`flex items-center space-x-2 py-3 px-3.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-amber-400 bg-[#133863] text-white font-semibold'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-[#113159]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </div>
    </nav>
  );
};
