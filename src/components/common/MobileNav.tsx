import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { Home, Compass, Plus, Hammer, User, ShieldAlert } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'home' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'explore' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'समस्याएं' : 'Explore'}</span>
        </button>

        {/* Report (Prominent elevated CTA) */}
        <div className="relative -top-5">
          <button
            onClick={() => setActiveTab('report')}
            className="w-13 h-13 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-xl flex flex-col items-center justify-center ring-4 ring-white transition-transform active:scale-95"
            title="Report a Problem"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Projects */}
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'projects' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Hammer className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'प्रोजेक्ट' : 'Projects'}</span>
        </button>

        {/* Accountability / Profile */}
        <button
          onClick={() => setActiveTab('accountability')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            activeTab === 'accountability' || activeTab === 'profile' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'जवाबदेही' : 'Account'}</span>
        </button>
      </div>
    </div>
  );
};
