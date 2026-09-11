import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { ProblemCategory, ProblemSeverity } from '../../types';
import {
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Building,
} from 'lucide-react';

export const CATEGORIES: ProblemCategory[] = [
  'Roads & Transport',
  'Water Resources',
  'Agriculture',
  'Sanitation',
  'Healthcare',
  'Education',
  'Environment',
  'Energy',
  'Infrastructure',
  'Public Services',
  'Other',
];

export const LocalDashboard: React.FC = () => {
  const { location, setSelectedProblemId, setActiveTab, triggerRefresh, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const problems = apiService.getProblems();

  const filteredProblems = problems.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesCategory;
  });

  const handleSupport = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    apiService.supportProblem(id, 'SUPPORT');
    triggerRefresh();
  };

  const getSeverityBadge = (severity: ProblemSeverity) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {language === 'hi' ? 'क्षेत्रीय नागरिक डैशबोर्ड' : 'Community Problem Feed'}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              {location.block}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi'
              ? 'आपके क्षेत्र में नागरिकों द्वारा दर्ज की गई समस्याएं एवं उनकी विभागीय प्रगति।'
              : 'Public challenges reported in your locality and their active status.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="self-start sm:self-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report Problem'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'} ({problems.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = problems.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat}</span>
              {count > 0 && <span className="ml-1 text-[10px] opacity-75 font-mono">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Problems List or Clean Empty State */}
      {filteredProblems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi'
                ? 'वर्तमान में कोई खुली समस्या दर्ज नहीं है'
                : `No active challenges reported in ${location.block} yet`}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'hi'
                ? 'यदि आपके क्षेत्र में सड़क, पेयजल, बिजली, सफाई या स्कूल संबंधी कोई समस्या है, तो सीधे रिपोर्ट दर्ज करें।'
                : 'If you notice infrastructure defects or civic problems in your area, submit a report to initiate department action.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'समस्या दर्ज करें' : 'Report a Problem'}</span>
            </button>
            <button
              onClick={() => setActiveTab('transparency')}
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'पारदर्शिता व समाधान सूची' : 'Transparency List'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => {
                setSelectedProblemId(problem.id);
                setActiveTab('explore');
              }}
              className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {problem.id}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {problem.category}
                    </span>
                  </div>
                  {getSeverityBadge(problem.severity)}
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                  {language === 'hi' && problem.titleHi ? problem.titleHi : problem.title}
                </h4>

                <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {problem.location?.block} • {problem.location?.village}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {language === 'hi' && problem.descriptionHi ? problem.descriptionHi : problem.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={(e) => handleSupport(e, problem.id)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{problem.supportersCount || 1}</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                  <span>{language === 'hi' ? 'विवरण देखें' : 'View Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
