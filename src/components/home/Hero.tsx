import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ArrowRight,
  PlusCircle,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab, location, setIsLocationModalOpen, language } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white pt-8 pb-10 sm:pt-10 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/50">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Top Civic Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-xs font-semibold text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {language === 'hi'
                ? 'झारखंड जन-समाधान • लोक सेवा गारंटी एवं नागरिक निवारण पोर्टल'
                : 'Jharkhand Citizen Public Services & Grievance Redressal Portal'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{location.district}</span>
            <span className="text-slate-500">/</span>
            <span className="text-emerald-300">{location.block}</span>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="ml-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              ({language === 'hi' ? 'बदलें' : 'Change'})
            </button>
          </div>
        </div>

        {/* Main Headline & Simple Action Row */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'hi' ? (
              <>नागरिक समस्याएं दर्ज करें, <span className="text-emerald-400">विभागीय समाधान</span> ट्रैक करें।</>
            ) : (
              <>Report Civic Problems, <span className="text-emerald-400">Track Department Action</span>.</>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'hi'
              ? 'सड़क, पेयजल, बिजली, सफाई अथवा विद्यालय संबंधी समस्याओं की सीधी शिकायत दर्ज करें। प्रत्येक टिकट पर अधिकारी की समय-सीमा (SLA) और समाधान प्रगति पारदर्शी रूप से देखें।'
              : 'Directly submit civic issues with photos and GPS. Track department officer assignments, SLA countdowns, and verify completed community works.'}
          </p>
        </div>

        {/* 3 Prominent Primary Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 1. Report Problem Card */}
          <div
            onClick={() => setActiveTab('report')}
            className="group bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-5 border border-emerald-500/50 shadow-lg hover:shadow-emerald-900/50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200 border border-white/20">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                {language === 'hi' ? '1. नई समस्या दर्ज करें' : '1. Report a Problem'}
              </h2>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {language === 'hi'
                  ? 'फोटो, आवाज या विवरण सहित अपने वार्ड/गांव की समस्या दर्ज करें। तत्काल ट्रैकिंग आईडी पाएं।'
                  : 'Submit a new grievance with photos, location, and audio note. Receive an instant tracking ID.'}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-200">
              <span>{language === 'hi' ? 'शिकायत फॉर्म खोलें' : 'Open Report Wizard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. My Reports & Status Card */}
          <div
            onClick={() => setActiveTab('my-reports')}
            className="group bg-slate-800/90 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-500 shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                {language === 'hi' ? '2. मेरी समस्याएं व स्थिति' : '2. My Reports & Status'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी दर्ज शिकायतों की वास्तविक विभागीय स्थिति, अधिकारी का नाम और समय-सीमा (SLA) जांचें।'
                  : 'Check assigned department officers, active SLA timelines, and official resolution progress.'}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-300">
              <span>{language === 'hi' ? 'मेरी शिकायतें देखें' : 'View My Tickets'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Transparency & Solutions Tracker Card */}
          <div
            onClick={() => setActiveTab('transparency')}
            className="group bg-gradient-to-br from-teal-950 to-slate-900 rounded-2xl p-5 border border-teal-600/50 hover:border-teal-400 shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300 border border-teal-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                {language === 'hi' ? '3. पारदर्शिता व समाधान सूची' : '3. Transparency & Solutions'}
              </h2>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी समस्याओं के पूरे हुए समाधान देखें, विभागीय कार्यप्रणाली जांचें और संतुष्टि दर्ज करें।'
                  : 'Jump directly to verified solutions, inspect contractor accountability, and validate ground outcomes.'}
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-teal-800/60 flex items-center justify-between text-xs font-bold text-teal-300">
              <span>{language === 'hi' ? 'समाधान सूची पर जाएं' : 'Jump to Solutions'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
