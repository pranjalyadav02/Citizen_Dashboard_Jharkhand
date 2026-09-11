import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { Home, Compass, Plus, ShieldCheck, User, FileText } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg max-w-full">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'home' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        {/* My Reports */}
        <button
          onClick={() => setActiveTab('my-reports')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'my-reports' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'मेरी रिपोर्टें' : 'Reports'}</span>
        </button>

        {/* Report (Prominent elevated CTA) */}
        <div className="relative -top-5">
          <button
            onClick={() => setActiveTab('report')}
            className="w-12 h-12 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-xl flex flex-col items-center justify-center ring-4 ring-white transition-transform active:scale-95"
            title="Report a Problem"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Transparency */}
        <button
          onClick={() => setActiveTab('transparency')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'transparency' ? 'text-emerald-800 font-extrabold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5 text-emerald-700" />
          <span>{language === 'hi' ? 'समाधान' : 'Solutions'}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-1.5 rounded-lg text-[10px] font-bold ${
            activeTab === 'profile' ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </button>
      </div>
    </div>
  );
};
