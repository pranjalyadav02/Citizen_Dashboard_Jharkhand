import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ArrowRight,
  PlusCircle,
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Building,
  GraduationCap,
  Users,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab, location, setIsLocationModalOpen, setIsShowcaseTourOpen, language } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/50">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gov Civic Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {language === 'hi'
                  ? 'जन समाधान: झारखंड सामाजिक नवाचार व जवाबदेही मंच'
                  : 'Grassroots Innovation & Public Accountability Engine'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              {language === 'hi' ? (
                <>स्थानीय समस्याओं को <span className="text-emerald-400">ठोस समाधान</span> में बदलें।</>
              ) : (
                <>Turn local problems into <span className="text-emerald-400">real solutions</span>.</>
              )}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'अपने समुदाय की नागरिक चुनौतियों को दर्ज करें, उन्हें सरकार, विश्वविद्यालयों और उद्योग से जोड़ें, और समस्या से स्थायी प्रभाव तक के सफर को ट्रैक करें।'
                : 'Report challenges in your community, connect them with government, universities and industry, and follow the journey from problem to impact.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('report')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-emerald-900/50 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-100" />
                <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold border border-slate-700 hover:border-slate-600 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'मेरा क्षेत्र देखें' : 'Explore My Area'}</span>
              </button>

              <button
                onClick={() => setIsShowcaseTourOpen(true)}
                className="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs sm:text-sm font-bold border border-amber-400/40 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Interactive SIH Demo Tour</span>
              </button>
            </div>

            {/* 4 Pillars of the platform */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Citizen Reports</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gov Verification</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>University R&D</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Citizen Audit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Location Card & Showcase Alert */}
          <div className="lg:col-span-4 space-y-4">
            {/* Location Card */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      {language === 'hi' ? 'आपका कार्यक्षेत्र' : 'Your Selected Area'}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-none">
                      {location.block} Block
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'hi' ? 'स्थान बदलें' : 'Change Location'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">District</span>
                  <span className="font-semibold text-slate-200">{location.district}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Panchayat</span>
                  <span className="font-semibold text-slate-200">{location.panchayat}</span>
                </div>
                <div className="col-span-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Village</span>
                    <span className="font-semibold text-slate-200 truncate">{location.village}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Showcase Story Card */}
            <div
              onClick={() => setIsShowcaseTourOpen(true)}
              className="group bg-gradient-to-r from-amber-950/80 to-slate-900/90 rounded-2xl p-4 border border-amber-500/40 shadow-lg cursor-pointer hover:border-amber-400 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded">
                      Featured SIH Case
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                    Kanke to Boreya Road: Missed 30-Day Defect SLA
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Follow the full journey from citizen pothole report to contractor liability & State Accountability.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 self-center group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
