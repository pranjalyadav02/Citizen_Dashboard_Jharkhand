import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { LocationModal } from './components/common/LocationModal';
import { SearchModal } from './components/common/SearchModal';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

import { Hero } from './components/home/Hero';
import { LocalDashboard } from './components/home/LocalDashboard';
import { ProblemList } from './components/explore/ProblemList';
import { ReportWizard } from './components/report/ReportWizard';
import { MyReports } from './components/reports/MyReports';
import { TransparencySolutionsTracker } from './components/transparency/TransparencySolutionsTracker';
import { ProjectTracker } from './components/projects/ProjectTracker';
import { WorkVerification } from './components/verify/WorkVerification';
import { InfrastructureRegistry } from './components/accountability/InfrastructureRegistry';
import { IntegrityModule } from './components/accountability/IntegrityModule';
import { StateAccountabilityWall } from './components/accountability/StateAccountabilityWall';
import { CitizenProfile } from './components/profile/CitizenProfile';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 w-full max-w-full overflow-x-hidden">
      {activeTab === 'home' && (
        <div className="space-y-4">
          <Hero />
          <LocalDashboard />
        </div>
      )}

      {activeTab === 'explore' && <ProblemList />}

      {activeTab === 'report' && <ReportWizard />}

      {activeTab === 'my-reports' && <MyReports />}

      {activeTab === 'transparency' && <TransparencySolutionsTracker />}

      {activeTab === 'projects' && <ProjectTracker />}

      {activeTab === 'verify' && <WorkVerification />}

      {activeTab === 'infrastructure' && <InfrastructureRegistry />}

      {activeTab === 'integrity' && <IntegrityModule />}

      {activeTab === 'accountability' && <StateAccountabilityWall />}

      {activeTab === 'profile' && <CitizenProfile />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
        <Header />
        <MainContent />
        <Footer />
        <MobileNav />

        {/* Global Modals & PWA Prompts */}
        <LocationModal />
        <SearchModal />
        <PWAInstallBanner />
      </div>
    </AppProvider>
  );
}
