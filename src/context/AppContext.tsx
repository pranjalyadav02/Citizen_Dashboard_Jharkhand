/**
 * JanaSamadhan - Application Context
 * Centralized state for geographic filtering, navigation, notifications,
 * language, accessibility, and demo mode.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Citizen,
  CitizenNotification,
  Problem,
  Project,
  InfrastructureAsset,
  IntegrityCase,
} from '../types';
import { CURRENT_CITIZEN } from '../data/mockData';
import { apiService } from '../services/apiService';

export type TabType =
  | 'home'
  | 'explore'
  | 'report'
  | 'my-reports'
  | 'projects'
  | 'verify'
  | 'infrastructure'
  | 'integrity'
  | 'accountability'
  | 'transparency'
  | 'profile';

export type Language = 'en' | 'hi';

export interface LocationState {
  district: string;
  block: string;
  panchayat: string;
  village: string;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  location: LocationState;
  setLocation: (loc: LocationState) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isShowcaseTourOpen: boolean;
  setIsShowcaseTourOpen: (open: boolean) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  citizen: Citizen;
  notifications: CitizenNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  // Detail selection
  selectedProblemId: string | null;
  setSelectedProblemId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  // Data refresh triggers
  refreshTrigger: number;
  triggerRefresh: () => void;
  // Quick navigation helper
  navigateToProblem: (id: string) => void;
  navigateToProject: (id: string) => void;
  navigateToAsset: (id: string) => void;
  navigateToIntegrityCase: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [location, setLocation] = useState<LocationState>({
    district: 'Ranchi',
    block: 'Kanke',
    panchayat: 'Boreya',
    village: 'Boreya Basti (Village X)',
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isShowcaseTourOpen, setIsShowcaseTourOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);

  useEffect(() => {
    setNotifications(apiService.getNotifications());
  }, [refreshTrigger]);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (id: string) => {
    apiService.markNotificationRead(id);
    triggerRefresh();
  };

  const markAllNotificationsRead = () => {
    apiService.markAllNotificationsRead();
    triggerRefresh();
  };

  const navigateToProblem = (id: string) => {
    setSelectedProblemId(id);
    setActiveTab('explore');
  };

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projects');
  };

  const navigateToAsset = (id: string) => {
    setSelectedAssetId(id);
    setActiveTab('infrastructure');
  };

  const navigateToIntegrityCase = (id: string) => {
    setSelectedCaseId(id);
    setActiveTab('integrity');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        location,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isShowcaseTourOpen,
        setIsShowcaseTourOpen,
        demoMode,
        setDemoMode,
        isOffline,
        setIsOffline,
        citizen: CURRENT_CITIZEN,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        selectedProblemId,
        setSelectedProblemId,
        selectedProjectId,
        setSelectedProjectId,
        selectedAssetId,
        setSelectedAssetId,
        selectedCaseId,
        setSelectedCaseId,
        refreshTrigger,
        triggerRefresh,
        navigateToProblem,
        navigateToProject,
        navigateToAsset,
        navigateToIntegrityCase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
