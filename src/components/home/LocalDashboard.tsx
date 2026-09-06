import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/apiService';
import { Problem, ProblemCategory, ProblemSeverity } from '../../types';
import {
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  Share2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Layers,
  Sparkles,
  Users,
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
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Infrastructure',
  'Public Services',
  'Urban Development',
  'Other',
];

export const LocalDashboard: React.FC = () => {
  const { location, setSelectedProblemId, setActiveTab, triggerRefresh, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const problems = apiService.getProblems();
  const projects = apiService.getProjects();
  const verifications = apiService.getWorkVerifications();

  // Filter problems for current block/community (or fallback to all if matching none)
  const communityProblems = problems.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || p.severity === selectedSeverity;
    return matchesCategory && matchesSeverity;
  });

  // Calculate statistics
  const openCount = problems.filter((p) => p.stage === 'Submitted' || p.stage === 'AI Triaged').length;
  const underVerificationCount = problems.filter((p) => p.stage === 'Community Validated' || p.stage === 'Government Verified').length;
  const activeProjectsCount = projects.filter((pr) => pr.trl < 9).length;
  const completedSolutionsCount = projects.filter((pr) => pr.trl >= 9).length;
  const pendingCitizenVerificationCount = verifications.filter((v) => v.status === 'Verification_Open').length;

  const handleSupport = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    apiService.supportProblem(id, 'SUPPORT');
    triggerRefresh();
  };

  const handleExperienced = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    apiService.supportProblem(id, 'EXPERIENCED_THIS');
    triggerRefresh();
  };

  const getSeverityBadge = (severity: ProblemSeverity) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Critical Severity</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High Severity</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStageBadge = (stage: string) => {
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center space-x-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        <span>{stage}</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Local Stats Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans tracking-tight">
                {location.block} Block
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {location.district} District
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hi' ? 'आपका समुदाय व स्थानीय नवाचार डैशबोर्ड' : 'Your Community Civic & Innovation Dashboard'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('report')}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <span>+ Report In {location.block}</span>
          </button>
        </div>

        {/* 5 Core Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Open Problems */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Open Problems
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{openCount}</span>
              <span className="text-[10px] text-amber-600 font-semibold">Triage queue</span>
            </div>
          </div>

          {/* Under Verification */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Under Verification
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{underVerificationCount}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Panchayat verified</span>
            </div>
          </div>

          {/* Active Projects */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Active Projects
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{activeProjectsCount}</span>
              <span className="text-[10px] text-blue-600 font-semibold">University R&D</span>
            </div>
          </div>

          {/* Completed Solutions */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Completed Solutions
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{completedSolutionsCount}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Field deployed</span>
            </div>
          </div>

          {/* Pending Citizen Verification */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Pending Citizen Audit
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-amber-950">{pendingCitizenVerificationCount}</span>
              <span className="text-[10px] text-amber-800 font-bold">Needs your vote!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Problems Near You Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'आपके समीप दर्ज समस्याएं' : 'Problems Near You'}
            </h3>
            <p className="text-xs text-slate-500">
              Grassroots community issues reported by verified citizens in {location.block} & adjoining blocks.
            </p>
          </div>

          {/* Severity filter selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Categories ({problems.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = problems.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => {
                setSelectedProblemId(problem.id);
                setActiveTab('explore');
              }}
              className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
            >
              {/* Card Top Strip */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {problem.id}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {problem.category}
                    </span>
                  </div>
                  {getSeverityBadge(problem.severity)}
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                  {problem.title}
                </h4>

                {/* Location & Reported date */}
                <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{problem.location.block} • {problem.location.village}</span>
                  <span>•</span>
                  <span>{problem.reportedDate}</span>
                </div>

                {/* Description excerpt */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>

                {/* If part of a cluster */}
                {problem.clusterName && (
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Part of: <strong>{problem.clusterName}</strong></span>
                  </div>
                )}
              </div>

              {/* Card Bottom Meta & Interactive Support Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  {getStageBadge(problem.stage)}
                  {problem.isGovernmentVerified && (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Gov Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleSupport(e, problem.id)}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center space-x-1 transition-colors cursor-pointer"
                      title="Support this problem"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{problem.supportersCount}</span>
                    </button>
                    <button
                      onClick={(e) => handleExperienced(e, problem.id)}
                      className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg border border-slate-200 transition-colors"
                      title="I have experienced this issue too"
                    >
                      Experienced ({problem.experiencedCount})
                    </button>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
