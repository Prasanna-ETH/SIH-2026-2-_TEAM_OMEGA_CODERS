import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { TopGovStrip } from './components/TopGovStrip';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { NotificationModal } from './components/NotificationModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { AicteDashboardPage } from './pages/AicteDashboardPage';
import { InstitutionDashboardPage } from './pages/InstitutionDashboardPage';
import { StudentUploadPage } from './pages/StudentUploadPage';
import { StudentRegistryPage } from './pages/StudentRegistryPage';
import { StudentDetailPage } from './pages/StudentDetailPage';
import { ValidationCentrePage } from './pages/ValidationCentrePage';
import { DuplicateDetectionPage } from './pages/DuplicateDetectionPage';
import { IntakeCompliancePage } from './pages/IntakeCompliancePage';
import { InstitutionsListPage } from './pages/InstitutionsListPage';
import { InstitutionProfilePage } from './pages/InstitutionProfilePage';
import { VerificationPortalPage } from './pages/VerificationPortalPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { apiClient } from './api/client';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>('/aicte/dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Update default route on role switch
  useEffect(() => {
    if (!user) {
      setCurrentRoute('/login');
    } else if (user.role === 'AICTE_ADMIN') {
      setCurrentRoute('/aicte/dashboard');
    } else if (user.role === 'INSTITUTION') {
      setCurrentRoute('/institution/dashboard');
    } else if (user.role === 'VERIFIER') {
      setCurrentRoute('/verification');
    }
  }, [user?.role]);

  // Load notifications
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await apiClient.getNotifications(user?.role);
        setNotifications(res.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchNotifs();
    }
  }, [user?.role, currentRoute]);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    setSelectedStudentId(null);
    setSelectedInstitutionId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
    setCurrentRoute(`/students/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectInstitution = (id: number) => {
    setSelectedInstitutionId(id);
    setCurrentRoute(`/institutions/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || currentRoute === '/login') {
    return (
      <div className="min-h-screen flex flex-col bg-[#f4f6f9]">
        <TopGovStrip />
        <Header onOpenNotifications={() => {}} unreadNotificationsCount={0} />
        <main id="main-content" className="flex-1">
          <LoginPage
            onLoginSuccess={() => {
              if (user?.role === 'INSTITUTION') {
                setCurrentRoute('/institution/dashboard');
              } else {
                setCurrentRoute('/aicte/dashboard');
              }
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9]">
      <TopGovStrip />
      <Header
        onOpenNotifications={() => setIsNotifOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.is_read).length}
      />
      <Navigation currentRoute={currentRoute} onRouteChange={handleNavigate} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Breadcrumb strip */}
        <div className="mb-4 text-xs text-slate-500 font-medium flex items-center space-x-1.5">
          <span className="text-slate-400">Home</span>
          <span>/</span>
          <span className="text-slate-700 capitalize font-semibold">
            {currentRoute.replace('/', '').replace('-', ' ') || 'Dashboard'}
          </span>
        </div>

        {/* Route Pages */}
        {currentRoute === '/aicte/dashboard' && <AicteDashboardPage onNavigate={handleNavigate} />}
        {currentRoute === '/institution/dashboard' && <InstitutionDashboardPage onNavigate={handleNavigate} />}
        {currentRoute === '/institution/upload' && <StudentUploadPage onNavigate={handleNavigate} />}
        
        {currentRoute === '/students' && (
          <StudentRegistryPage onSelectStudent={handleSelectStudent} />
        )}
        {currentRoute.startsWith('/students/') && selectedStudentId && (
          <StudentDetailPage
            studentId={selectedStudentId}
            onBack={() => handleNavigate('/students')}
          />
        )}

        {currentRoute === '/institutions' && (
          <InstitutionsListPage onSelectInstitution={handleSelectInstitution} />
        )}
        {currentRoute.startsWith('/institutions/') && selectedInstitutionId && (
          <InstitutionProfilePage
            institutionId={selectedInstitutionId}
            onBack={() => handleNavigate('/institutions')}
          />
        )}

        {currentRoute === '/validation' && <ValidationCentrePage />}
        {currentRoute === '/duplicates' && <DuplicateDetectionPage />}
        {currentRoute === '/intake-compliance' && <IntakeCompliancePage />}
        {currentRoute === '/verification' && <VerificationPortalPage />}
        {currentRoute === '/analytics' && <AnalyticsPage />}
        {currentRoute === '/audit' && <AuditTrailPage />}
      </main>

      <Footer />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
