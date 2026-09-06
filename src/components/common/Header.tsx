import React, { useState, useRef, useEffect } from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  MapPin,
  Globe,
  Bell,
  Search,
  PlusCircle,
  User,
  ShieldCheck,
  Check,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    location,
    setIsLocationModalOpen,
    setIsSearchModalOpen,
    setIsShowcaseTourOpen,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    demoMode,
    setDemoMode,
    isOffline,
    setIsOffline,
    citizen,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: TabType; label: string; labelHi: string }[] = [
    { id: 'home', label: 'Home', labelHi: 'होम' },
    { id: 'explore', label: 'Explore Problems', labelHi: 'समस्याएं देखें' },
    { id: 'my-reports', label: 'My Reports', labelHi: 'मेरी रिपोर्टें' },
    { id: 'projects', label: 'Track Projects', labelHi: 'परियोजनाएं' },
    { id: 'verify', label: 'Verify Work', labelHi: 'सत्यापन' },
    { id: 'infrastructure', label: 'Road & Assets', labelHi: 'सड़क व परिसंपत्तियां' },
    { id: 'integrity', label: 'Report Concern', labelHi: 'शिकायत दर्ज करें' },
    { id: 'accountability', label: 'Accountability', labelHi: 'जवाबदेही' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Official Government of Jharkhand Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-medium tracking-wide text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>झारखंड सरकार</span>
            <span className="text-slate-500">|</span>
            <span>Government of Jharkhand</span>
          </div>
          <span className="hidden md:inline-block text-[11px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
            Smart India Hackathon (SIH) 2026 Innovation Initiative
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline simulator toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`hidden sm:flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
              isOffline
                ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle simulated offline mode"
          >
            {isOffline ? <WifiOff className="w-3 h-3 text-rose-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
            <span>{isOffline ? 'Offline Mode Active' : 'Online'}</span>
          </button>

          {/* Demo Mode Button */}
          <button
            onClick={() => setIsShowcaseTourOpen(true)}
            className="flex items-center space-x-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-900/70 border border-amber-700/50 px-2.5 py-0.5 rounded transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SIH Showcase Story</span>
          </button>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 text-[11px] font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded cursor-pointer"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-slate-800 text-xs font-semibold z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3 h-3 text-emerald-700" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 flex items-center justify-between"
                >
                  <span>हिन्दी</span>
                  {language === 'hi' && <Check className="w-3 h-3 text-emerald-700" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Portal Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          {/* Emblem-like emblem icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-emerald-700/50">
            <span className="font-extrabold text-base tracking-tighter text-amber-300">JS</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                JanaSamadhan
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Citizen Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Jharkhand Societal Innovation & Accountability Platform
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Location Selector Pill */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 transition-all cursor-pointer"
            title="Change administrative jurisdiction"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[170px]">
              {location.block}, {location.district}
            </span>
            <ChevronDown className="w-3 h-3 text-emerald-700 shrink-0" />
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Global Search (Problem ID, Road, University, Contractor)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold bg-rose-500 px-1.5 py-0.2 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-emerald-300 hover:text-emerald-100 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab as TabType);
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Citizen Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`p-2 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'profile' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : ''
            }`}
            title="Citizen Profile"
          >
            <User className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-semibold hidden md:inline-block truncate max-w-[90px]">
              {citizen.name.split(' ')[0]}
            </span>
          </button>

          {/* Primary CTA: Report a Problem */}
          <button
            onClick={() => setActiveTab('report')}
            className="px-3.5 sm:px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-slate-50/90 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-emerald-900 shadow-xs border border-slate-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {language === 'hi' ? item.labelHi : item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Offline Alert Ribbon if simulated offline */}
      {isOffline && (
        <div className="bg-rose-600 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-center space-x-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>You are offline. Reports will be saved locally on this device and synced when connected.</span>
        </div>
      )}
    </header>
  );
};
